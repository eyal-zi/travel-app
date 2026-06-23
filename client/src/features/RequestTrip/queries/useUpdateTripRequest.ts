import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripRequestService } from '../services/tripRequestService'
import type { TripRequestStatus } from '../types'
import { tripRequestsKey } from './useTripRequests'

type UpdateVars = {
  id: string
  status?: TripRequestStatus
  adminNote?: string
}

/**
 * Owns the admin update mutation (status and/or note). On success it invalidates
 * the trip-requests list prefix so every status-filtered variant refetches and
 * the card reflects (or leaves, under an active filter) its new state.
 */
export const useUpdateTripRequest = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, ...payload }: UpdateVars) =>
      tripRequestService.update(id, payload).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripRequestsKey })
    },
  })

  return {
    updateRequest: mutation.mutate,
    // Promise-returning variant, for sequencing inside a batched save.
    updateRequestAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    // The status of the in-flight transition, so the UI can spotlight just the
    // button that was clicked rather than disabling the whole row blindly.
    pendingStatus: mutation.isPending ? mutation.variables.status : undefined,
    updateError: mutation.isError,
    resetUpdateError: mutation.reset,
  }
}
