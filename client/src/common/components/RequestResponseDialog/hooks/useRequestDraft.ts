import { useState } from 'react'
import { useNotification } from '../../../hooks/useNotification'
import type { RequestStatus } from '../../../requests/requestStatus'
import type { RequestDraft } from '../RequestResponseDialog.types'
import type { UseRequestDraftArgs } from './useRequestDraft.types'

/**
 * Owns the admin response editor's draft: status, note, and staged/removed file
 * changes that only take effect on save. Reseeds whenever the dialog (re)opens,
 * then commits everything in one sequence, surfacing the outcome via the shared
 * notification. Returns `save()`'s success so the dialog can close on it.
 *
 * Feature-agnostic: the caller supplies the request and the mutation functions,
 * so trip and file requests share one implementation.
 */
export const useRequestDraft = ({
  request,
  open,
  updateRequestAsync,
  addFileAsync,
  removeFileAsync,
}: UseRequestDraftArgs): RequestDraft => {
  const { notification, notifyError, notifySuccess, close } = useNotification()

  const [statusDraft, setStatusDraft] = useState(request.status)
  const [noteDraft, setNoteDraft] = useState(request.adminNote ?? '')
  // Files chosen but not yet uploaded, and existing files marked for deletion —
  // both only take effect on Save.
  const [stagedFiles, setStagedFiles] = useState<File[]>([])
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Reseed each time the dialog transitions to open so it reflects the latest
  // saved state and drops abandoned edits. Adjusting state during render is the
  // React-recommended alternative to an effect here.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setStatusDraft(request.status)
      setNoteDraft(request.adminNote ?? '')
      setStagedFiles([])
      setRemovedFileIds([])
    }
  }

  const statusDirty = statusDraft !== request.status
  const noteDirty = noteDraft !== (request.adminNote ?? '')
  const filesDirty = stagedFiles.length > 0 || removedFileIds.length > 0
  const canSave = statusDirty || noteDirty || filesDirty

  const setStatus = (status: RequestStatus) => setStatusDraft(status)
  const setNote = (note: string) => setNoteDraft(note)
  const stageFile = (file: File) => setStagedFiles((files) => [...files, file])
  const unstageFile = (index: number) =>
    setStagedFiles((files) => files.filter((_, i) => i !== index))
  const toggleRemoveExisting = (fileId: string) =>
    setRemovedFileIds((ids) =>
      ids.includes(fileId) ? ids.filter((id) => id !== fileId) : [...ids, fileId],
    )

  // Commit status/note, then file removals, then additions, in sequence.
  const save = async (): Promise<boolean> => {
    setSaving(true)
    try {
      if (statusDirty || noteDirty) {
        await updateRequestAsync({
          id: request.id,
          ...(statusDirty && { status: statusDraft }),
          ...(noteDirty && { adminNote: noteDraft }),
        })
      }
      for (const fileId of removedFileIds) {
        await removeFileAsync({ id: request.id, fileId })
      }
      for (const file of stagedFiles) {
        await addFileAsync({ id: request.id, file })
      }
      setStagedFiles([])
      setRemovedFileIds([])
      notifySuccess('Changes saved.')
      return true
    } catch {
      notifyError('Could not save your changes. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    statusDraft,
    noteDraft,
    stagedFiles,
    removedFileIds,
    saving,
    canSave,
    setStatus,
    setNote,
    stageFile,
    unstageFile,
    toggleRemoveExisting,
    save,
    notification,
    closeNotification: close,
  }
}
