



import api from '../../../common/api/axios'
import type {
  CreateFileRequest,
  FileRequest,
  FileRequestPage,
  FileRequestStatus,
  RespondFileRequest,
} from '../types'

export const fileRequestService = {
  list: (params?: {
    cursor?: string
    limit?: number
    status?: FileRequestStatus
  }) => api.get<FileRequestPage>('/api/file-requests', { params }),

  create: (payload: CreateFileRequest) =>
    api.post<FileRequest>('/api/file-requests', payload),

  
  update: (
    id: string,
    payload: { status?: FileRequestStatus; adminNote?: string },
  ) => api.patch<FileRequest>(`/api/file-requests/${id}`, payload),

  
  
  
  respond: (id: string, payload: RespondFileRequest) =>
    api.post<FileRequest>(`/api/file-requests/${id}/respond`, payload),
}
