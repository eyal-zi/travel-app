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

const LARGE_FILE_BUCKET = process.env.S3_LARGE_FILE_BUCKET ?? 'large-files';

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

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(private readonly s3: S3Service) {}

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

  listParts(dto: ListPartsDto): Promise<ListedPart[]> {
    return this.s3.listParts({
      key: dto.key,
      bucket: LARGE_FILE_BUCKET,
      uploadId: dto.uploadId,
    });
  }

  async abort(dto: AbortMultipartUploadDto): Promise<void> {
    await this.s3.abortMultipartUpload({
      key: dto.key,
      bucket: LARGE_FILE_BUCKET,
      uploadId: dto.uploadId,
    });
    this.logger.log(`Aborted multipart upload ${dto.uploadId} for ${dto.key}`);
  }
}
