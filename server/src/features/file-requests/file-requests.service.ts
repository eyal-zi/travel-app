import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { and, desc, eq, inArray, lt } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import { S3Service } from '../../common/storage/s3.service';
import {
  fileRequestFiles,
  fileRequests,
  FileRequest,
  FileRequestFile,
  type FileRequestStatus,
} from './file-requests.schema';
import { CreateFileRequestDto } from './dto/create-file-request.dto';
import { UpdateFileRequestDto } from './dto/update-file-request.dto';

// A file plus a short-lived presigned URL the client can download it from.
export interface FileRequestFileWithUrl extends FileRequestFile {
  signedUrl: string;
}

// A file request enriched with the admin's attached files (each carrying a
// download URL). `adminNote` already lives on the row.
export interface FileRequestWithFiles extends FileRequest {
  files: FileRequestFileWithUrl[];
}

export interface FileRequestPage {
  items: FileRequestWithFiles[];
  // `createdAt` of the last item, to be passed back as the next cursor. Null when
  // there are no older file requests left.
  nextCursor: string | null;
}

const DEFAULT_LIMIT = 20;

@Injectable()
export class FileRequestsService {
  private readonly logger = new Logger(FileRequestsService.name);
  private readonly bucket =
    process.env.S3_FILE_REQUEST_BUCKET ?? 'file-request-files';

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly s3: S3Service,
  ) {}

  // Newest-first page, optionally filtered by status. Fetches limit + 1 rows to
  // tell whether an older page exists, then trims to the requested size and
  // exposes the cursor.
  async findPage(
    limit = DEFAULT_LIMIT,
    cursor?: string,
    status?: FileRequestStatus,
  ): Promise<FileRequestPage> {
    const rows = await this.db
      .select()
      .from(fileRequests)
      .where(
        and(
          cursor ? lt(fileRequests.createdAt, new Date(cursor)) : undefined,
          status ? eq(fileRequests.status, status) : undefined,
        ),
      )
      .orderBy(desc(fileRequests.createdAt), desc(fileRequests.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const pageRows = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore
      ? pageRows[pageRows.length - 1].createdAt.toISOString()
      : null;

    const items = await this.attachFiles(pageRows);
    return { items, nextCursor };
  }

  async create(dto: CreateFileRequestDto): Promise<FileRequest> {
    // `status` is omitted so it falls back to the column default ("received").
    const [fileRequest] = await this.db
      .insert(fileRequests)
      .values(dto)
      .returning();
    this.logger.log(`Created file request ${fileRequest.id}`);
    return fileRequest;
  }

  // Admin update: advance the workflow `status` and/or set the `adminNote`. Only
  // the provided fields change. `updatedAt` bumps automatically via $onUpdate.
  async update(id: string, dto: UpdateFileRequestDto): Promise<FileRequest> {
    const patch: Partial<Pick<FileRequest, 'status' | 'adminNote'>> = {};
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.adminNote !== undefined) patch.adminNote = dto.adminNote;

    const [fileRequest] = await this.db
      .update(fileRequests)
      .set(patch)
      .where(eq(fileRequests.id, id))
      .returning();
    if (!fileRequest) {
      throw new NotFoundException(`File request ${id} not found`);
    }
    this.logger.log(`Updated file request ${id}`);
    return fileRequest;
  }

  // Attaches a file to a request. Stored under a uuid-based S3 key (keeping the
  // original extension) so uploads never collide; the original name and type are
  // kept for download.
  async addFile(
    id: string,
    file: Express.Multer.File,
  ): Promise<FileRequestFileWithUrl> {
    await this.ensureExists(id);

    const key = `${randomUUID()}${extname(file.originalname)}`;
    await this.s3.uploadFile({
      key,
      body: file.buffer,
      bucket: this.bucket,
      contentType: file.mimetype,
    });

    const [row] = await this.db
      .insert(fileRequestFiles)
      .values({
        fileRequestId: id,
        fileKey: key,
        fileName: file.originalname,
        contentType: file.mimetype,
      })
      .returning();
    this.logger.log(`Attached file ${key} to file request ${id}`);

    return this.withUrl(row);
  }

  // Removes a file from a request. The S3 object is left in place — dropping the
  // row is enough to hide it from clients.
  async removeFile(id: string, fileId: string): Promise<void> {
    const result = await this.db
      .delete(fileRequestFiles)
      .where(
        and(
          eq(fileRequestFiles.id, fileId),
          eq(fileRequestFiles.fileRequestId, id),
        ),
      )
      .returning({ id: fileRequestFiles.id });
    if (result.length === 0) {
      throw new NotFoundException(
        `File ${fileId} not found on file request ${id}`,
      );
    }
    this.logger.log(`Removed file ${fileId} from file request ${id}`);
  }

  private async ensureExists(id: string): Promise<void> {
    const [row] = await this.db
      .select({ id: fileRequests.id })
      .from(fileRequests)
      .where(eq(fileRequests.id, id))
      .limit(1);
    if (!row) throw new NotFoundException(`File request ${id} not found`);
  }

  // Loads the files for a set of requests in one query and groups them onto each
  // request. Signed URLs are generated locally (no network) and download as the
  // original filename.
  private async attachFiles(
    rows: FileRequest[],
  ): Promise<FileRequestWithFiles[]> {
    if (rows.length === 0) return [];

    const fileRows = await this.db
      .select()
      .from(fileRequestFiles)
      .where(
        inArray(
          fileRequestFiles.fileRequestId,
          rows.map((row) => row.id),
        ),
      )
      .orderBy(desc(fileRequestFiles.createdAt));

    const filesByRequest = new Map<string, FileRequestFileWithUrl[]>();
    for (const file of fileRows) {
      const list = filesByRequest.get(file.fileRequestId) ?? [];
      list.push(this.withUrl(file));
      filesByRequest.set(file.fileRequestId, list);
    }

    return rows.map((row) => ({
      ...row,
      files: filesByRequest.get(row.id) ?? [],
    }));
  }

  private withUrl(file: FileRequestFile): FileRequestFileWithUrl {
    const signedUrl = this.s3.getSignedUrl(
      file.fileKey,
      this.bucket,
      3600,
      `attachment; filename="${file.fileName}"`,
    );
    return { ...file, signedUrl };
  }
}
