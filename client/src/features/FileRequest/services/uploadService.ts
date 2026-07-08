



import api from '../../../common/api/axios'
import type {
  CompletedUpload,
  CreatedUpload,
  ListedPart,
  SignedPart,
  UploadedPart,
} from './upload.types'

export const uploadService = {
  
  create: (fileName: string, contentType?: string) =>
    api.post<CreatedUpload>('/api/uploads/multipart/create', {
      fileName,
      contentType,
    }),

  
  sign: (key: string, uploadId: string, partNumbers: number[]) =>
    api.post<{ urls: SignedPart[] }>('/api/uploads/multipart/sign', {
      key,
      uploadId,
      partNumbers,
    }),

  
  list: (key: string, uploadId: string) =>
    api.post<ListedPart[]>('/api/uploads/multipart/list', { key, uploadId }),

  
  complete: (key: string, uploadId: string, parts: UploadedPart[]) =>
    api.post<CompletedUpload>('/api/uploads/multipart/complete', {
      key,
      uploadId,
      parts,
    }),

  
  abort: (key: string, uploadId: string) =>
    api.post('/api/uploads/multipart/abort', { key, uploadId }),
}
