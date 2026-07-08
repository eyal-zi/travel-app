import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import type { CreateFileRequest } from '../types'
import { fileRequestsKey } from './useFileRequests'






export const useCreateFileRequest = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: CreateFileRequest) =>
      fileRequestService.create(payload).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fileRequestsKey })
    },
  })

  return {
    submit: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    submitError: mutation.isError,
    resetSubmitError: mutation.reset,
  }
}
