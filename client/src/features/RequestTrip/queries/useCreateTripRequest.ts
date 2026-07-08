import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripRequestService } from '../services/tripRequestService'
import type { CreateTripRequest } from '../types'
import { tripRequestsKey } from './useTripRequests'






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
