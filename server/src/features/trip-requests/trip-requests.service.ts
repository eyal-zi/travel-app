import { randomUUID } from 'crypto';
import { extname } from 'path';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, inArray, lt } from 'drizzle-orm';
import {
  DRIZZLE,
  type DrizzleDB,
} from '../../common/database/database.constants';
import { S3Service } from '../../common/storage/s3.service';
import {
  tripRequestFiles,
  tripRequests,
  TripRequest,
  TripRequestFile,
  type TripRequestStatus,
} from './trip-requests.schema';
import { CreateTripRequestDto } from './dto/create-trip-request.dto';
import { UpdateTripRequestDto } from './dto/update-trip-request.dto';

// A file plus a short-lived presigned URL the client can download it from.
export interface TripRequestFileWithUrl extends TripRequestFile {
  signedUrl: string;
}

// A trip request enriched with the admin's attached files (each carrying a
// download URL). `adminNote` already lives on the row.
export interface TripRequestWithFiles extends TripRequest {
  files: TripRequestFileWithUrl[];
}

export interface TripRequestPage {
  items: TripRequestWithFiles[];
  // `createdAt` of the last item, to be passed back as the next cursor. Null when
  // there are no older trip requests left.
  nextCursor: string | null;
}

const DEFAULT_LIMIT = 20;

@Injectable()
export class TripRequestsService {
  private readonly logger = new Logger(TripRequestsService.name);
  private readonly bucket =
    process.env.S3_TRIP_REQUEST_BUCKET ?? 'trip-request-files';

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
    status?: TripRequestStatus,
  ): Promise<TripRequestPage> {
    const rows = await this.db
      .select()
      .from(tripRequests)
      .where(
        and(
          cursor ? lt(tripRequests.createdAt, new Date(cursor)) : undefined,
          status ? eq(tripRequests.status, status) : undefined,
        ),
      )
      .orderBy(desc(tripRequests.createdAt), desc(tripRequests.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const pageRows = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore
      ? pageRows[pageRows.length - 1].createdAt.toISOString()
      : null;

    const items = await this.attachFiles(pageRows);
    return { items, nextCursor };
  }

  async create(dto: CreateTripRequestDto): Promise<TripRequest> {
    // `status` is omitted so it falls back to the column default ("received").
    const [tripRequest] = await this.db
      .insert(tripRequests)
      .values(dto)
      .returning();
    this.logger.log(`Created trip request ${tripRequest.id}`);
    return tripRequest;
  }

  // Admin update: advance the workflow `status` and/or set the `adminNote`. Only
  // the provided fields change. `updatedAt` bumps automatically via $onUpdate.
  async update(
    id: string,
    dto: UpdateTripRequestDto,
  ): Promise<TripRequest> {
    const patch: Partial<Pick<TripRequest, 'status' | 'adminNote'>> = {};
    if (dto.status !== undefined) patch.status = dto.status;
    if (dto.adminNote !== undefined) patch.adminNote = dto.adminNote;

    const [tripRequest] = await this.db
      .update(tripRequests)
      .set(patch)
      .where(eq(tripRequests.id, id))
      .returning();
    if (!tripRequest) {
      throw new NotFoundException(`Trip request ${id} not found`);
    }
    this.logger.log(`Updated trip request ${id}`);
    return tripRequest;
  }

  // Attaches a file to a request. Stored under a uuid-based S3 key (keeping the
  // original extension) so uploads never collide; the original name and type are
  // kept for download.
  async addFile(
    id: string,
    file: Express.Multer.File,
  ): Promise<TripRequestFileWithUrl> {
    await this.ensureExists(id);

    const key = `${randomUUID()}${extname(file.originalname)}`;
    await this.s3.uploadFile({
      key,
      body: file.buffer,
      bucket: this.bucket,
      contentType: file.mimetype,
    });

    const [row] = await this.db
      .insert(tripRequestFiles)
      .values({
        tripRequestId: id,
        fileKey: key,
        fileName: file.originalname,
        contentType: file.mimetype,
      })
      .returning();
    this.logger.log(`Attached file ${key} to trip request ${id}`);

    return this.withUrl(row);
  }

  // Removes a file from a request. The S3 object is left in place — dropping the
  // row is enough to hide it from clients.
  async removeFile(id: string, fileId: string): Promise<void> {
    const result = await this.db
      .delete(tripRequestFiles)
      .where(
        and(
          eq(tripRequestFiles.id, fileId),
          eq(tripRequestFiles.tripRequestId, id),
        ),
      )
      .returning({ id: tripRequestFiles.id });
    if (result.length === 0) {
      throw new NotFoundException(
        `File ${fileId} not found on trip request ${id}`,
      );
    }
    this.logger.log(`Removed file ${fileId} from trip request ${id}`);
  }

  private async ensureExists(id: string): Promise<void> {
    const [row] = await this.db
      .select({ id: tripRequests.id })
      .from(tripRequests)
      .where(eq(tripRequests.id, id))
      .limit(1);
    if (!row) throw new NotFoundException(`Trip request ${id} not found`);
  }

  // Loads the files for a set of requests in one query and groups them onto each
  // request. Signed URLs are generated locally (no network) and download as the
  // original filename.
  private async attachFiles(
    rows: TripRequest[],
  ): Promise<TripRequestWithFiles[]> {
    if (rows.length === 0) return [];

    const fileRows = await this.db
      .select()
      .from(tripRequestFiles)
      .where(
        inArray(
          tripRequestFiles.tripRequestId,
          rows.map((row) => row.id),
        ),
      )
      .orderBy(desc(tripRequestFiles.createdAt));

    const filesByRequest = new Map<string, TripRequestFileWithUrl[]>();
    for (const file of fileRows) {
      const list = filesByRequest.get(file.tripRequestId) ?? [];
      list.push(this.withUrl(file));
      filesByRequest.set(file.tripRequestId, list);
    }

    return rows.map((row) => ({
      ...row,
      files: filesByRequest.get(row.id) ?? [],
    }));
  }

  private withUrl(file: TripRequestFile): TripRequestFileWithUrl {
    const signedUrl = this.s3.getSignedUrl(
      file.fileKey,
      this.bucket,
      3600,
      `attachment; filename="${file.fileName}"`,
    );
    return { ...file, signedUrl };
  }
}
