// Trip requests: newest-first cursor-paginated reads plus a create. `status` is
// set server-side ("received") on intake, so create only sends the form fields;
// admins move requests through the workflow via updateStatus.

import api from '../../../common/api/axios'
import type {
  CreateTripRequest,
  TripRequest,
  TripRequestFile,
  TripRequestPage,
  TripRequestStatus,
} from '../types'

export const tripRequestService = {
  list: (params?: {
    cursor?: string
    limit?: number
    status?: TripRequestStatus
  }) => api.get<TripRequestPage>('/api/trip-requests', { params }),

  create: (payload: CreateTripRequest) =>
    api.post<TripRequest>('/api/trip-requests', payload),

  // Admin update: change status and/or admin note. Send only what changed.
  update: (
    id: string,
    payload: { status?: TripRequestStatus; adminNote?: string },
  ) => api.patch<TripRequest>(`/api/trip-requests/${id}`, payload),

  // Attaches a file. Multipart "file" part; axios infers the Content-Type and
  // boundary from the FormData body (see pdfService).
  addFile: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<TripRequestFile>(`/api/trip-requests/${id}/files`, form)
  },

  removeFile: (id: string, fileId: string) =>
    api.delete(`/api/trip-requests/${id}/files/${fileId}`),
}
