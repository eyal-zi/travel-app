import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import type { FileRequestStatus } from '../types'
import { fileRequestsKey } from './useFileRequests'

type UpdateVars = {
  id: string
  status?: FileRequestStatus
  adminNote?: string
}






export const useUpdateFileRequest = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, ...payload }: UpdateVars) =>
      fileRequestService.update(id, payload).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fileRequestsKey })
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
