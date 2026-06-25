import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import { fileRequestsKey } from './useFileRequests'

/**
 * Admin file attach/remove mutations. Both invalidate the file-requests list
 * prefix on success so the card's file list refetches with fresh signed URLs.
 */
export const useFileRequestFiles = () => {
  const queryClient = useQueryClient()
  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: fileRequestsKey })

  const addFile = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      fileRequestService.addFile(id, file).then((res) => res.data),
    onSuccess: invalidate,
  })

  const removeFile = useMutation({
    mutationFn: ({ id, fileId }: { id: string; fileId: string }) =>
      fileRequestService.removeFile(id, fileId),
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
