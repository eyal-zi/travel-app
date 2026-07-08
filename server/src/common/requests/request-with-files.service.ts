import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq, getTableColumns, inArray } from 'drizzle-orm';
import { alias, type PgColumn, type PgTable } from 'drizzle-orm/pg-core';
import type { DrizzleDB } from '../database/database.constants';
import type { RequestStatus } from '../database/enums';
import { buildPage, keysetCondition, type Page } from '../pagination/keyset';
import type { S3Service } from '../storage/s3.service';

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

export type WithSignedUrl<TFile> = TFile & { signedUrl: string };

export interface RequestUsernames {
  createdByUsername: string | null;
  updatedByUsername: string | null;
}

export type WithFiles<TRequest, TFile> = TRequest &
  RequestUsernames & {
    files: WithSignedUrl<TFile>[];
  };

export interface RequestUpdate {
  status?: RequestStatus;
  adminNote?: string;
}

export interface RequestBaseConfig {
  requestTable: PgTable;
  idColumn: PgColumn;
  createdAtColumn: PgColumn;
  statusColumn: PgColumn;

  createdByColumn: PgColumn;
  updatedByColumn: PgColumn;

  userTable: PgTable;
  userIdColumn: PgColumn;
  userNameColumn: PgColumn;

  label: string;
}

export interface RequestServiceConfig extends RequestBaseConfig {
  fileTable: PgTable;
  fileForeignKeyColumn: PgColumn;
  fileCreatedAtColumn: PgColumn;
  fileIdColumn: PgColumn;
  bucket: string;
}

const DEFAULT_LIMIT = 20;

export abstract class RequestService<
  TRequest extends RequestRow,
  TCreate,
  TItem = TRequest & RequestUsernames,
> {
  protected readonly logger = new Logger(this.constructor.name);

  protected abstract readonly config: RequestBaseConfig;

  constructor(protected readonly db: DrizzleDB) {}

  async findPage(
    limit = DEFAULT_LIMIT,
    cursor?: string,
    status?: RequestStatus,
  ): Promise<Page<TItem>> {
    const {
      requestTable,
      createdAtColumn,
      idColumn,
      statusColumn,
      createdByColumn,
      updatedByColumn,
      userTable,
    } = this.config;

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
    const items = await this.enrich(page.items);
    return { items, nextCursor: page.nextCursor };
  }

  protected async enrich(
    rows: (TRequest & RequestUsernames)[],
  ): Promise<TItem[]> {
    return rows as unknown as TItem[];
  }

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

  protected columnName(table: PgTable, column: PgColumn): string {
    const columns = getTableColumns(table);
    const name = Object.keys(columns).find((key) => columns[key] === column);
    if (!name) {
      throw new Error('Configured column not found on table');
    }
    return name;
  }

  protected get lowerLabel(): string {
    return this.config.label.toLowerCase();
  }
}

export abstract class RequestWithFilesService<
  TRequest extends RequestRow,
  TFile extends RequestFileRow,
  TCreate,
> extends RequestService<TRequest, TCreate, WithFiles<TRequest, TFile>> {
  protected abstract readonly config: RequestServiceConfig;

  constructor(
    db: DrizzleDB,
    protected readonly s3: S3Service,
  ) {
    super(db);
  }

  protected async enrich(
    rows: (TRequest & RequestUsernames)[],
  ): Promise<WithFiles<TRequest, TFile>[]> {
    return this.attachFiles(rows);
  }

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
}
