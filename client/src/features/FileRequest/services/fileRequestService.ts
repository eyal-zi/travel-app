// File requests: newest-first cursor-paginated reads plus a create. `status` is
// set server-side ("received") on intake, so create only sends the form fields;
// admins move requests through the workflow via update.

import api from '../../../common/api/axios'
import type {
  CreateFileRequest,
  FileRequest,
  FileRequestFile,
  FileRequestPage,
  FileRequestStatus,
} from '../types'

export const fileRequestService = {
  list: (params?: {
    cursor?: string
    limit?: number
    status?: FileRequestStatus
  }) => api.get<FileRequestPage>('/api/file-requests', { params }),

  create: (payload: CreateFileRequest) =>
    api.post<FileRequest>('/api/file-requests', payload),

  // Admin update: change status and/or admin note. Send only what changed.
  update: (
    id: string,
    payload: { status?: FileRequestStatus; adminNote?: string },
  ) => api.patch<FileRequest>(`/api/file-requests/${id}`, payload),

  // Attaches a file. Multipart "file" part; axios infers the Content-Type and
  // boundary from the FormData body.
  addFile: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<FileRequestFile>(`/api/file-requests/${id}/files`, form)
  },

  removeFile: (id: string, fileId: string) =>
    api.delete(`/api/file-requests/${id}/files/${fileId}`),
}
