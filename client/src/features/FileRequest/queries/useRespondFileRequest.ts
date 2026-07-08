import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import type { RespondFileRequest } from '../types'
import { fileRequestsKey } from './useFileRequests'







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
    
    respondAsync: mutation.mutateAsync,
    isResponding: mutation.isPending,
  }
}
