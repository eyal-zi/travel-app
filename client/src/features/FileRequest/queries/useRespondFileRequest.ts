import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import { fileRequestsKey } from './useFileRequests'

/**
 * Owns the admin "respond" mutation: uploads the fulfilling large file (metadata
 * + file, as multipart FormData) and links it to the request. On success it
 * invalidates the file-requests list prefix so every status-filtered variant
 * refetches and the card reflects its new state.
 */
export const useRespondFileRequest = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      fileRequestService.respond(id, form).then((res) => res.data),
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
