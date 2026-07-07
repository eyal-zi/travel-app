import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from '../../common/storage/s3.service';
import type { ListedPart } from '../../common/storage/s3.types';
import {
  AbortMultipartUploadDto,
  CompleteMultipartUploadDto,
  CreateMultipartUploadDto,
  ListPartsDto,
  SignPartsDto,
} from './dto/multipart.dto';

// Objects uploaded through this flow land in the same bucket the large-file
// admin flow reads from (see LargeFilesService).
const LARGE_FILE_BUCKET = process.env.S3_LARGE_FILE_BUCKET ?? 'large-files';

// Presigned URLs are short-lived; a large upload asks for fresh batches as it goes
// rather than signing every part up front.
const PART_URL_TTL_SECONDS = 3600;

export interface CreatedUpload {
  key: string;
  uploadId: string;
}

export interface SignedPart {
  partNumber: number;
  url: string;
}

export interface CompletedUpload {
  key: string;
  sizeBytes: number;
  contentType?: string;
}

// Orchestrates presigned multipart uploads straight from the browser to S3/MinIO.
// The bytes never pass through this server: it only opens the upload, signs each
// part's PUT, and finalizes (or aborts) once the client is done.
@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(private readonly s3: S3Service) {}

  // Opens an upload under a server-generated key (random name, original extension),
  // matching the key scheme LargeFilesService used when it uploaded directly.
  async create(dto: CreateMultipartUploadDto): Promise<CreatedUpload> {
    const key = `${randomUUID()}${extname(dto.fileName)}`;
    const uploadId = await this.s3.createMultipartUpload({
      key,
      bucket: LARGE_FILE_BUCKET,
      contentType: dto.contentType,
    });
    this.logger.log(`Opened multipart upload ${uploadId} for ${key}`);
    return { key, uploadId };
  }

  // Signs a batch of part PUTs for an open upload.
  signParts(dto: SignPartsDto): SignedPart[] {
    return dto.partNumbers.map((partNumber) => ({
      partNumber,
      url: this.s3.signUploadPart({
        key: dto.key,
        bucket: LARGE_FILE_BUCKET,
        uploadId: dto.uploadId,
        partNumber,
        expiresInSeconds: PART_URL_TTL_SECONDS,
      }),
    }));
  }

  // Assembles the parts into the final object, then reads its real size/type from
  // S3 so callers record what actually landed rather than trusting the client.
  async complete(dto: CompleteMultipartUploadDto): Promise<CompletedUpload> {
    await this.s3.completeMultipartUpload({
      key: dto.key,
      bucket: LARGE_FILE_BUCKET,
      uploadId: dto.uploadId,
      parts: dto.parts,
    });

    const head = await this.s3.headObject(dto.key, LARGE_FILE_BUCKET);
    this.logger.log(`Completed multipart upload for ${dto.key}`);
    return {
      key: dto.key,
      sizeBytes: head.contentLength ?? 0,
      contentType: head.contentType,
    };
  }

  // Lists the parts already uploaded, so the client can resume without re-sending
  // finished parts.
  listParts(dto: ListPartsDto): Promise<ListedPart[]> {
    return this.s3.listParts({
      key: dto.key,
      bucket: LARGE_FILE_BUCKET,
      uploadId: dto.uploadId,
    });
  }

  // Best-effort abort of an abandoned upload so its parts don't linger.
  async abort(dto: AbortMultipartUploadDto): Promise<void> {
    await this.s3.abortMultipartUpload({
      key: dto.key,
      bucket: LARGE_FILE_BUCKET,
      uploadId: dto.uploadId,
    });
    this.logger.log(`Aborted multipart upload ${dto.uploadId} for ${dto.key}`);
  }
}
