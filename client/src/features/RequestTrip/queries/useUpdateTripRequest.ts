import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripRequestService } from '../services/tripRequestService'
import type { TripRequestStatus } from '../types'
import { tripRequestsKey } from './useTripRequests'

type UpdateVars = {
  id: string
  status?: TripRequestStatus
  adminNote?: string
}






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
    
    updateRequestAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    
    
    pendingStatus: mutation.isPending ? mutation.variables.status : undefined,
    updateError: mutation.isError,
    resetUpdateError: mutation.reset,
  }
}
