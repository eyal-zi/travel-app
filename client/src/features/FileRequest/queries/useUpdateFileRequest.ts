import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import type { FileRequestStatus } from '../types'
import { fileRequestsKey } from './useFileRequests'

type UpdateVars = {
  id: string
  status?: FileRequestStatus
  adminNote?: string
}

/**
 * Owns the admin update mutation (status and/or note). On success it invalidates
 * the file-requests list prefix so every status-filtered variant refetches and
 * the card reflects (or leaves, under an active filter) its new state.
 */
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
    // Promise-returning variant, for sequencing inside a batched save.
    updateRequestAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    pendingStatus: mutation.isPending ? mutation.variables.status : undefined,
    updateError: mutation.isError,
    resetUpdateError: mutation.reset,
  }
}
