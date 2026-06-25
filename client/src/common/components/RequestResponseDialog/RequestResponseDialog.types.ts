import type { Notification } from '../../hooks/useNotification'
import type { RequestStatus } from '../../requests/requestStatus'

// A file the admin attached to a request, with a short-lived download URL.
export type RequestFile = {
  id: string
  fileName: string
  contentType: string
  signedUrl: string
}

// The subset of a request the response dialog renders. Both trip requests and
// file requests satisfy this shape (`tripGoal` is the headline shown in the title).
export type RequestSummary = {
  id: string
  tripGoal: string
  status: RequestStatus
  adminNote: string | null
  files: RequestFile[]
}

// The draft state owned by a feature-specific `use*Draft` hook and consumed by
// the admin editor. Both features return this exact shape.
export type RequestDraft = {
  statusDraft: RequestStatus
  noteDraft: string
  stagedFiles: File[]
  removedFileIds: string[]
  saving: boolean
  canSave: boolean
  setStatus: (status: RequestStatus) => void
  setNote: (note: string) => void
  stageFile: (file: File) => void
  unstageFile: (index: number) => void
  toggleRemoveExisting: (fileId: string) => void
  save: () => Promise<boolean>
  notification: Notification | null
  closeNotification: () => void
}
