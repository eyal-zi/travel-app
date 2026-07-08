import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import {
  AbortMultipartUploadParams,
  CompleteMultipartUploadParams,
  CreateMultipartUploadParams,
  HeadObjectResult,
  ListedPart,
  ListPartsParams,
  RetrievedFile,
  SignUploadPartParams,
  UploadFileParams,
  UploadFileResult,
} from './s3.types';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
      s3ForcePathStyle: true,

      signatureVersion: 'v4',
    });
  }

  async uploadFile({
    key,
    body,
    bucket,
    contentType,
  }: UploadFileParams): Promise<UploadFileResult> {
    await this.s3
      .putObject({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ContentLength: body.length,
      })
      .promise();

    return { bucket, key };
  }

  async getFile(key: string, bucket: string): Promise<RetrievedFile> {
    try {
      const response = await this.s3
        .getObject({ Bucket: bucket, Key: key })
        .promise();

      return {
        body: this.toBuffer(response.Body),
        contentType: response.ContentType,
        contentLength: response.ContentLength,
      };
    } catch (error) {
      if (this.isNotFound(error)) {
        throw new NotFoundException(
          `File "${key}" not found in bucket "${bucket}"`,
        );
      }
      this.logger.error(
        `Failed to retrieve file "${key}" from bucket "${bucket}"`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  getSignedUrl(
    key: string,
    bucket: string,
    expiresInSeconds = 3600,

    contentDisposition?: string,
  ): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: expiresInSeconds,
      ResponseContentDisposition: contentDisposition,
    });
  }

  async createMultipartUpload({
    key,
    bucket,
    contentType,
  }: CreateMultipartUploadParams): Promise<string> {
    const { UploadId } = await this.s3
      .createMultipartUpload({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      })
      .promise();

    if (!UploadId) {
      throw new Error(`S3 did not return an UploadId for "${key}"`);
    }
    return UploadId;
  }

  signUploadPart({
    key,
    bucket,
    uploadId,
    partNumber,
    expiresInSeconds = 3600,
  }: SignUploadPartParams): string {
    return this.s3.getSignedUrl('uploadPart', {
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
      Expires: expiresInSeconds,
    });
  }

  async completeMultipartUpload({
    key,
    bucket,
    uploadId,
    parts,
  }: CompleteMultipartUploadParams): Promise<void> {
    await this.s3
      .completeMultipartUpload({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: [...parts]
            .sort((a, b) => a.partNumber - b.partNumber)
            .map((part) => ({ ETag: part.etag, PartNumber: part.partNumber })),
        },
      })
      .promise();
  }

  async listParts({
    key,
    bucket,
    uploadId,
  }: ListPartsParams): Promise<ListedPart[]> {
    const parts: ListedPart[] = [];
    let partNumberMarker: number | undefined;

    do {
      const page = await this.s3
        .listParts({
          Bucket: bucket,
          Key: key,
          UploadId: uploadId,
          PartNumberMarker: partNumberMarker,
        })
        .promise();

      for (const part of page.Parts ?? []) {
        if (part.PartNumber && part.ETag) {
          parts.push({
            partNumber: part.PartNumber,
            size: part.Size ?? 0,
            etag: part.ETag,
          });
        }
      }

      partNumberMarker = page.IsTruncated
        ? page.NextPartNumberMarker
        : undefined;
    } while (partNumberMarker);

    return parts;
  }

  async abortMultipartUpload({
    key,
    bucket,
    uploadId,
  }: AbortMultipartUploadParams): Promise<void> {
    await this.s3
      .abortMultipartUpload({ Bucket: bucket, Key: key, UploadId: uploadId })
      .promise();
  }

  async headObject(key: string, bucket: string): Promise<HeadObjectResult> {
    try {
      const response = await this.s3
        .headObject({ Bucket: bucket, Key: key })
        .promise();
      return {
        contentLength: response.ContentLength,
        contentType: response.ContentType,
      };
    } catch (error) {
      if (this.isNotFound(error)) {
        throw new NotFoundException(
          `File "${key}" not found in bucket "${bucket}"`,
        );
      }
      throw error;
    }
  }

  private toBuffer(body: S3.Body | undefined): Buffer {
    if (!body) {
      return Buffer.alloc(0);
    }
    if (Buffer.isBuffer(body)) {
      return body;
    }
    if (typeof body === 'string' || body instanceof Uint8Array) {
      return Buffer.from(body as Uint8Array);
    }
    return Buffer.from(body as ArrayBuffer);
  }

  private isNotFound(error: unknown): boolean {
    const code = (error as { code?: string; statusCode?: number })?.code;
    const statusCode = (error as { statusCode?: number })?.statusCode;
    return code === 'NoSuchKey' || code === 'NotFound' || statusCode === 404;
  }
}
