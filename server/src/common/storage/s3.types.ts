export interface UploadFileParams {
  key: string;
  body: Buffer;
  bucket: string;
  contentType?: string;
}

export interface UploadFileResult {
  bucket: string;
  key: string;
}

export interface RetrievedFile {
  body: Buffer;
  contentType?: string;
  contentLength?: number;
}

export interface CreateMultipartUploadParams {
  key: string;
  bucket: string;
  contentType?: string;
}

export interface SignUploadPartParams {
  key: string;
  bucket: string;
  uploadId: string;
  partNumber: number;
  expiresInSeconds?: number;
}

export interface UploadedPart {
  partNumber: number;
  etag: string;
}

export interface CompleteMultipartUploadParams {
  key: string;
  bucket: string;
  uploadId: string;
  parts: UploadedPart[];
}

export interface AbortMultipartUploadParams {
  key: string;
  bucket: string;
  uploadId: string;
}

export interface HeadObjectResult {
  contentLength?: number;
  contentType?: string;
}

export interface ListPartsParams {
  key: string;
  bucket: string;
  uploadId: string;
}

export interface ListedPart {
  partNumber: number;
  size: number;
  etag: string;
}
