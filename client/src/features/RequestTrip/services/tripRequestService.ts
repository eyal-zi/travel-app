



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

  
  update: (
    id: string,
    payload: { status?: TripRequestStatus; adminNote?: string },
  ) => api.patch<TripRequest>(`/api/trip-requests/${id}`, payload),

  
  
  addFile: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<TripRequestFile>(`/api/trip-requests/${id}/files`, form)
  },

  removeFile: (id: string, fileId: string) =>
    api.delete(`/api/trip-requests/${id}/files/${fileId}`),
}
