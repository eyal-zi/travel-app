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

// A part reported by the client after a successful PUT, as returned by S3.
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

// A part already uploaded to an open multipart upload, as reported by S3. Used to
// resume an interrupted upload without re-sending finished parts.
export interface ListedPart {
  partNumber: number;
  size: number;
  etag: string;
}
