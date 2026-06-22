import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripRequestService } from '../services/tripRequestService'
import type { TripRequestStatus } from '../types'
import { tripRequestsKey } from './useTripRequests'

/**
 * Owns the admin status-change mutation. On success it invalidates the
 * trip-requests list prefix so every status-filtered variant refetches and the
 * card reflects (or leaves, under an active filter) its new status.
 */
export const useUpdateTripRequestStatus = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TripRequestStatus }) =>
      tripRequestService.updateStatus(id, status).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripRequestsKey })
    },
  })

  return {
    updateStatus: mutation.mutate,
    isUpdating: mutation.isPending,
    // The status of the in-flight transition, so the UI can spotlight just the
    // button that was clicked rather than disabling the whole row blindly.
    pendingStatus: mutation.isPending ? mutation.variables.status : undefined,
    updateError: mutation.isError,
    resetUpdateError: mutation.reset,
  }
}
