import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripRequestService } from '../services/tripRequestService'
import { tripRequestsKey } from './useTripRequests'

/**
 * Admin file attach/remove mutations. Both invalidate the trip-requests list
 * prefix on success so the card's file list refetches with fresh signed URLs.
 */
export const useTripRequestFiles = () => {
  const queryClient = useQueryClient()
  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: tripRequestsKey })

  const addFile = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      tripRequestService.addFile(id, file).then((res) => res.data),
    onSuccess: invalidate,
  })

  const removeFile = useMutation({
    mutationFn: ({ id, fileId }: { id: string; fileId: string }) =>
      tripRequestService.removeFile(id, fileId),
    onSuccess: invalidate,
  })

  return {
    addFile: addFile.mutate,
    // Promise-returning variants, for sequencing inside a batched save.
    addFileAsync: addFile.mutateAsync,
    removeFileAsync: removeFile.mutateAsync,
    isAddingFile: addFile.isPending,
    removeFile: removeFile.mutate,
    removingFileId: removeFile.isPending ? removeFile.variables.fileId : undefined,
    fileError: addFile.isError || removeFile.isError,
    resetFileError: () => {
      addFile.reset()
      removeFile.reset()
    },
  }
}
