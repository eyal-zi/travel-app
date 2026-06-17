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
