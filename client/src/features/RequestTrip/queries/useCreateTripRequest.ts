import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripRequestService } from '../services/tripRequestService'
import type { CreateTripRequest } from '../types'
import { tripRequestsKey } from './useTripRequests'

/**
 * Owns the create-trip-request mutation. On success it invalidates the
 * trip-requests list so a freshly submitted request shows up when the user
 * switches to the list view.
 */
export const useCreateTripRequest = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreateTripRequest) =>
      tripRequestService.create(payload).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripRequestsKey })
    },
  })

  return {
    submit: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    submitError: mutation.isError,
    resetSubmitError: mutation.reset,
  }
}
