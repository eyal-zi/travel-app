import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import type { CreateFileRequest } from '../types'
import { fileRequestsKey } from './useFileRequests'

/**
 * Owns the create-file-request mutation. On success it invalidates the
 * file-requests list so a freshly submitted request shows up when the user
 * switches to the list view.
 */
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
