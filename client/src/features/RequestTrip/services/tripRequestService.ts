// Trip requests: newest-first cursor-paginated reads plus a create. `status` is
// set server-side ("received") on intake, so create only sends the form fields;
// admins move requests through the workflow via updateStatus.

import api from '../../../common/api/axios'
import type {
  CreateTripRequest,
  TripRequest,
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

  updateStatus: (id: string, status: TripRequestStatus) =>
    api.patch<TripRequest>(`/api/trip-requests/${id}/status`, { status }),
}
