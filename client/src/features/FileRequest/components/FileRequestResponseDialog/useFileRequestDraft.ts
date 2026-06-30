import { useRequestDraft } from '../../../../common/components/RequestResponseDialog/hooks/useRequestDraft'
import { useUpdateFileRequest } from '../../queries/useUpdateFileRequest'
import { useFileRequestFiles } from '../../queries/useFileRequestFiles'
import type { FileRequest } from '../../types'

/**
 * Wires the file-request mutations into the shared `useRequestDraft`, which owns
 * the admin editor's batched status/note/file draft.
 */
export const useFileRequestDraft = (request: FileRequest, open: boolean) => {
  const { updateRequestAsync } = useUpdateFileRequest()
  const { addFileAsync, removeFileAsync } = useFileRequestFiles()

  return useRequestDraft({
    request,
    open,
    updateRequestAsync,
    addFileAsync,
    removeFileAsync,
  })
}
