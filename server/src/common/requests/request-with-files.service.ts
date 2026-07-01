import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq, getTableColumns, inArray } from 'drizzle-orm';
import { alias, type PgColumn, type PgTable } from 'drizzle-orm/pg-core';
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

// The usernames resolved (via join) from a request's created-by/updated-by user
// foreign keys, so clients can show who submitted and who last handled a request
// without exposing the raw ids. Null when unset or the user no longer exists.
export interface RequestUsernames {
  createdByUsername: string | null;
  updatedByUsername: string | null;
}

// A request enriched with its admin-attached files (each carrying a download URL)
// and the created-by/updated-by usernames.
export type WithFiles<TRequest, TFile> = TRequest &
  RequestUsernames & {
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
  // FK columns to `users.id`: who submitted the request and who last updated it.
  createdByColumn: PgColumn;
  updatedByColumn: PgColumn;
  fileForeignKeyColumn: PgColumn;
  fileCreatedAtColumn: PgColumn;
  fileIdColumn: PgColumn;
  // The users table and its id/username columns, joined to resolve the created-by
  // and updated-by usernames on read.
  userTable: PgTable;
  userIdColumn: PgColumn;
  userNameColumn: PgColumn;
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
    const {
      requestTable,
      createdAtColumn,
      idColumn,
      statusColumn,
      createdByColumn,
      updatedByColumn,
      userTable,
    } = this.config;

    // Join the users table twice (once per FK) to resolve the usernames without
    // exposing the raw ids. Left joins so a request survives a missing/deleted user.
    const createdByUser = alias(userTable, 'created_by_user');
    const updatedByUser = alias(userTable, 'updated_by_user');
    const createdByCols = getTableColumns(createdByUser);
    const updatedByCols = getTableColumns(updatedByUser);
    const idField = this.columnName(userTable, this.config.userIdColumn);
    const nameField = this.columnName(userTable, this.config.userNameColumn);

    const rows = (await this.db
      .select({
        ...getTableColumns(requestTable),
        createdByUsername: createdByCols[nameField],
        updatedByUsername: updatedByCols[nameField],
      })
      .from(requestTable)
      .leftJoin(createdByUser, eq(createdByColumn, createdByCols[idField]))
      .leftJoin(updatedByUser, eq(updatedByColumn, updatedByCols[idField]))
      .where(
        and(
          keysetCondition(createdAtColumn, idColumn, cursor),
          status ? eq(statusColumn, status) : undefined,
        ),
      )
      .orderBy(desc(createdAtColumn), desc(idColumn))
      .limit(limit + 1)) as unknown as (TRequest & RequestUsernames)[];

    const page = buildPage(rows, limit, (row) => ({
      createdAt: row.createdAt,
      id: row.id,
    }));
    const items = await this.attachFiles(page.items);
    return { items, nextCursor: page.nextCursor };
  }

  // `status` is omitted from the insert so it falls back to the column default.
  // `createdBy` stamps the submitting user (from the authenticated request).
  async create(dto: TCreate, createdBy?: string): Promise<TRequest> {
    const values: Record<string, unknown> = { ...(dto as object) };
    if (createdBy) {
      values[
        this.columnName(this.config.requestTable, this.config.createdByColumn)
      ] = createdBy;
    }

    const [row] = (await this.db
      .insert(this.config.requestTable)
      .values(values)
      .returning()) as unknown as TRequest[];
    this.logger.log(`Created ${this.lowerLabel} ${row.id}`);
    return row;
  }

  // Admin update: advance `status` and/or set `adminNote`, stamping `updatedBy`
  // with the acting admin. Only provided fields change; `updatedAt` bumps
  // automatically via $onUpdate.
  async update(
    id: string,
    patch: RequestUpdate,
    updatedBy?: string,
  ): Promise<TRequest> {
    const set: Record<string, unknown> = {};
    if (patch.status !== undefined) set.status = patch.status;
    if (patch.adminNote !== undefined) set.adminNote = patch.adminNote;
    if (updatedBy) {
      set[
        this.columnName(this.config.requestTable, this.config.updatedByColumn)
      ] = updatedBy;
    }

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
        [this.columnName(
          this.config.fileTable,
          this.config.fileForeignKeyColumn,
        )]: id,
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
    rows: (TRequest & RequestUsernames)[],
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

    const fkName = this.columnName(
      this.config.fileTable,
      this.config.fileForeignKeyColumn,
    );
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

  // JS field name (e.g. "tripRequestId") of a column on a table — used to set a
  // column by name on insert/update and to read one back off a row when grouping.
  private columnName(table: PgTable, column: PgColumn): string {
    const columns = getTableColumns(table);
    const name = Object.keys(columns).find((key) => columns[key] === column);
    if (!name) {
      throw new Error('Configured column not found on table');
    }
    return name;
  }

  private get lowerLabel(): string {
    return this.config.label.toLowerCase();
  }
}
