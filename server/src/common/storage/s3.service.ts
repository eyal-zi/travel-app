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
      // SigV4 so presigned URLs don't fold Content-Type into the signature: the
      // browser always attaches a Content-Type to each uploaded part, which a
      // SigV2 signature rejects (403). SigV4 only signs headers it's told to.
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
    // When set (e.g. `attachment; filename="report.pdf"`), the object is served
    // with this Content-Disposition so the browser downloads it rather than
    // rendering it inline.
    contentDisposition?: string,
  ): string {
    return this.s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: expiresInSeconds,
      ResponseContentDisposition: contentDisposition,
    });
  }

  // --- Multipart upload (direct browser -> S3) ---------------------------------
  // These back the presigned multipart flow: the client uploads each part straight
  // to S3 using URLs signed by `signUploadPart`, so file bytes never pass through
  // this server.

  // Opens a multipart upload and returns its id. ContentType is fixed here (parts
  // don't carry it) so the finished object is stored with the right type.
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

  // Presigns a single `uploadPart` PUT. The client PUTs the part's bytes to this
  // URL and reads the resulting ETag from the response.
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

  // Finalizes the upload by assembling the parts (ordered by part number) into the
  // final object.
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

  // Lists the parts already uploaded to an open multipart upload (paged through in
  // full), so a client can resume by skipping what's done. Ordered by part number.
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

  // Best-effort cleanup of an abandoned upload so its parts don't linger.
  async abortMultipartUpload({
    key,
    bucket,
    uploadId,
  }: AbortMultipartUploadParams): Promise<void> {
    await this.s3
      .abortMultipartUpload({ Bucket: bucket, Key: key, UploadId: uploadId })
      .promise();
  }

  // Reads an object's size/type without downloading it. Used at finalize to trust
  // S3 rather than the client for the recorded size.
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
