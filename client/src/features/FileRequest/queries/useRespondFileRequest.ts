import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import type { RespondFileRequest } from '../types'
import { fileRequestsKey } from './useFileRequests'

/**
 * Owns the admin "respond" mutation: records the fulfilling large file (metadata +
 * a reference to the already-uploaded S3 object) and links it to the request. On
 * success it invalidates the file-requests list prefix so every status-filtered
 * variant refetches and the card reflects its new state.
 */
export const useRespondFileRequest = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RespondFileRequest }) =>
      fileRequestService.respond(id, payload).then((res) => res.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: fileRequestsKey })
    },
  })

  return {
    // Promise-returning variant, so the dialog can close on success.
    respondAsync: mutation.mutateAsync,
    isResponding: mutation.isPending,
  }
}
