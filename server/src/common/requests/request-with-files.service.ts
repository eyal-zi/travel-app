import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq, getTableColumns, inArray } from 'drizzle-orm';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import type { DrizzleDB } from '../database/database.constants';
import type { RequestStatus } from '../database/enums';
import { buildPage, keysetCondition, type Page } from '../pagination/keyset';
import type { S3Service } from '../storage/s3.service';

// The minimal row shapes the shared logic reads. Concrete request/file rows widen
// these via the TRequest/TFile generics.
export interface RequestRow {
  id: string;
  createdAt: Date;
}

export interface RequestFileRow {
  id: string;
  fileKey: string;
  fileName: string;
  contentType: string;
  createdAt: Date;
}

// A file plus a short-lived presigned URL the client can download it from.
export type WithSignedUrl<TFile> = TFile & { signedUrl: string };

// A request enriched with its admin-attached files (each carrying a download URL).
export type WithFiles<TRequest, TFile> = TRequest & {
  files: WithSignedUrl<TFile>[];
};

// The fields an admin may change on a request.
export interface RequestUpdate {
  status?: RequestStatus;
  adminNote?: string;
}

// Tables and columns the shared queries touch. They are typed loosely
// (PgTable/PgColumn) because the base is reused across two table sets; the concrete
// row types arrive through the TRequest/TFile generics and results are asserted to
// them at the (few) query boundaries below.
export interface RequestServiceConfig {
  requestTable: PgTable;
  fileTable: PgTable;
  idColumn: PgColumn;
  createdAtColumn: PgColumn;
  statusColumn: PgColumn;
  fileForeignKeyColumn: PgColumn;
  fileCreatedAtColumn: PgColumn;
  fileIdColumn: PgColumn;
  bucket: string;
  // Singular label for log lines and 404 messages, e.g. "Trip request".
  label: string;
}

const DEFAULT_LIMIT = 20;

// Shared implementation for the trip-request and file-request features, which are
// identical apart from their tables, S3 bucket and labels: a newest-first keyset
// page of requests (each carrying its admin note and attached files), create, an
// admin status/note update, and file attach/remove. A subclass supplies `config`.
export abstract class RequestWithFilesService<
  TRequest extends RequestRow,
  TFile extends RequestFileRow,
  TCreate,
> {
  protected readonly logger = new Logger(this.constructor.name);

  protected abstract readonly config: RequestServiceConfig;

  constructor(
    protected readonly db: DrizzleDB,
    protected readonly s3: S3Service,
  ) {}

  // Newest-first page, optionally filtered by status. Fetches limit + 1 rows to
  // tell whether an older page exists, then trims and exposes the keyset cursor.
  async findPage(
    limit = DEFAULT_LIMIT,
    cursor?: string,
    status?: RequestStatus,
  ): Promise<Page<WithFiles<TRequest, TFile>>> {
    const { requestTable, createdAtColumn, idColumn, statusColumn } =
      this.config;

    const rows = (await this.db
      .select()
      .from(requestTable)
      .where(
        and(
          keysetCondition(createdAtColumn, idColumn, cursor),
          status ? eq(statusColumn, status) : undefined,
        ),
      )
      .orderBy(desc(createdAtColumn), desc(idColumn))
      .limit(limit + 1)) as unknown as TRequest[];

    const page = buildPage(rows, limit, (row) => ({
      createdAt: row.createdAt,
      id: row.id,
    }));
    const items = await this.attachFiles(page.items);
    return { items, nextCursor: page.nextCursor };
  }

  // `status` is omitted from the insert so it falls back to the column default.
  async create(dto: TCreate): Promise<TRequest> {
    const [row] = (await this.db
      .insert(this.config.requestTable)
      .values(dto as Record<string, unknown>)
      .returning()) as unknown as TRequest[];
    this.logger.log(`Created ${this.lowerLabel} ${row.id}`);
    return row;
  }

  // Admin update: advance `status` and/or set `adminNote`. Only provided fields
  // change; `updatedAt` bumps automatically via $onUpdate.
  async update(id: string, patch: RequestUpdate): Promise<TRequest> {
    const set: RequestUpdate = {};
    if (patch.status !== undefined) set.status = patch.status;
    if (patch.adminNote !== undefined) set.adminNote = patch.adminNote;

    const [row] = (await this.db
      .update(this.config.requestTable)
      .set(set)
      .where(eq(this.config.idColumn, id))
      .returning()) as unknown as TRequest[];
    if (!row) {
      throw new NotFoundException(`${this.config.label} ${id} not found`);
    }
    this.logger.log(`Updated ${this.lowerLabel} ${id}`);
    return row;
  }

  // Attaches a file to a request. Stored under a uuid-based S3 key (keeping the
  // original extension) so uploads never collide; the original name and type are
  // kept for download.
  async addFile(
    id: string,
    file: Express.Multer.File,
  ): Promise<WithSignedUrl<TFile>> {
    await this.ensureExists(id);

    const key = `${randomUUID()}${extname(file.originalname)}`;
    await this.s3.uploadFile({
      key,
      body: file.buffer,
      bucket: this.config.bucket,
      contentType: file.mimetype,
    });

    const [row] = (await this.db
      .insert(this.config.fileTable)
      .values({
        [this.foreignKeyName]: id,
        fileKey: key,
        fileName: file.originalname,
        contentType: file.mimetype,
      })
      .returning()) as unknown as TFile[];
    this.logger.log(`Attached file ${key} to ${this.lowerLabel} ${id}`);
    return this.withUrl(row);
  }

  // Removes a file from a request. The S3 object is left in place — dropping the
  // row is enough to hide it from clients.
  async removeFile(id: string, fileId: string): Promise<void> {
    const deleted = (await this.db
      .delete(this.config.fileTable)
      .where(
        and(
          eq(this.config.fileIdColumn, fileId),
          eq(this.config.fileForeignKeyColumn, id),
        ),
      )
      .returning({ id: this.config.fileIdColumn })) as { id: string }[];
    if (deleted.length === 0) {
      throw new NotFoundException(
        `File ${fileId} not found on ${this.lowerLabel} ${id}`,
      );
    }
    this.logger.log(`Removed file ${fileId} from ${this.lowerLabel} ${id}`);
  }

  protected async ensureExists(id: string): Promise<void> {
    const [row] = (await this.db
      .select({ id: this.config.idColumn })
      .from(this.config.requestTable)
      .where(eq(this.config.idColumn, id))
      .limit(1)) as { id: string }[];
    if (!row) {
      throw new NotFoundException(`${this.config.label} ${id} not found`);
    }
  }

  // Loads the files for a set of requests in one query and groups them onto each
  // request. Signed URLs are generated locally (no network) and download as the
  // original filename.
  private async attachFiles(
    rows: TRequest[],
  ): Promise<WithFiles<TRequest, TFile>[]> {
    if (rows.length === 0) return [];

    const fileRows = (await this.db
      .select()
      .from(this.config.fileTable)
      .where(
        inArray(
          this.config.fileForeignKeyColumn,
          rows.map((row) => row.id),
        ),
      )
      .orderBy(desc(this.config.fileCreatedAtColumn))) as unknown as TFile[];

    const fkName = this.foreignKeyName;
    const filesByRequest = new Map<string, WithSignedUrl<TFile>[]>();
    for (const file of fileRows) {
      const parentId = (file as Record<string, unknown>)[fkName] as string;
      const list = filesByRequest.get(parentId) ?? [];
      list.push(this.withUrl(file));
      filesByRequest.set(parentId, list);
    }

    return rows.map((row) => ({
      ...row,
      files: filesByRequest.get(row.id) ?? [],
    }));
  }

  private withUrl(file: TFile): WithSignedUrl<TFile> {
    const signedUrl = this.s3.getSignedUrl(
      file.fileKey,
      this.config.bucket,
      3600,
      `attachment; filename="${file.fileName}"`,
    );
    return { ...file, signedUrl };
  }

  // JS field name (e.g. "tripRequestId") of the configured FK column — used to set
  // it on insert and read it back off a row when grouping.
  private get foreignKeyName(): string {
    const columns = getTableColumns(this.config.fileTable);
    const name = Object.keys(columns).find(
      (key) => columns[key] === this.config.fileForeignKeyColumn,
    );
    if (!name) {
      throw new Error('Configured foreign-key column not found on file table');
    }
    return name;
  }

  private get lowerLabel(): string {
    return this.config.label.toLowerCase();
  }
}
