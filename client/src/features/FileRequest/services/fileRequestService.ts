// File requests: newest-first cursor-paginated reads plus a create. `status` is
// set server-side ("received") on intake, so create only sends the form fields;
// admins move requests through the workflow via update.

import api from '../../../common/api/axios'
import type {
  CreateFileRequest,
  FileRequest,
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

  // Admin response: creates the fulfilling large file and links it. The FormData
  // carries the uploaded "file" part plus the large-file metadata fields (with
  // `area` as a JSON string); axios infers the multipart Content-Type/boundary.
  respond: (id: string, form: FormData) =>
    api.post<FileRequest>(`/api/file-requests/${id}/respond`, form),
}
