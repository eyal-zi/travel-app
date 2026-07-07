// Thin client for the presigned multipart upload endpoints (admin only). These
// only orchestrate the upload — the file bytes are PUT straight to S3/MinIO with
// the URLs returned by `sign` (see multipartUpload.ts), never through our API.

import api from '../../../common/api/axios'
import type {
  CompletedUpload,
  CreatedUpload,
  ListedPart,
  SignedPart,
  UploadedPart,
} from './upload.types'

export const uploadService = {
  // Opens a multipart upload; the server picks the object key.
  create: (fileName: string, contentType?: string) =>
    api.post<CreatedUpload>('/api/uploads/multipart/create', {
      fileName,
      contentType,
    }),

  // Presigns PUT URLs for a batch of part numbers.
  sign: (key: string, uploadId: string, partNumbers: number[]) =>
    api.post<{ urls: SignedPart[] }>('/api/uploads/multipart/sign', {
      key,
      uploadId,
      partNumbers,
    }),

  // Lists parts already stored for an open upload, so it can resume.
  list: (key: string, uploadId: string) =>
    api.post<ListedPart[]>('/api/uploads/multipart/list', { key, uploadId }),

  // Assembles the uploaded parts into the final object.
  complete: (key: string, uploadId: string, parts: UploadedPart[]) =>
    api.post<CompletedUpload>('/api/uploads/multipart/complete', {
      key,
      uploadId,
      parts,
    }),

  // Best-effort discard of an abandoned upload.
  abort: (key: string, uploadId: string) =>
    api.post('/api/uploads/multipart/abort', { key, uploadId }),
}
