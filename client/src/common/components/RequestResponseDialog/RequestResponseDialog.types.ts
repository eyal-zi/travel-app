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
  // Admin-attached files (trip requests). Optional: file requests fulfil via a
  // linked large file instead, so they omit this.
  files?: RequestFile[]
  // Username of the requester (shown to admins) and of the admin who last handled
  // the request (shown to the requester). Null until set / user unknown.
  createdByUsername: string | null
  updatedByUsername: string | null
  // When the request was last updated — shown alongside `updatedByUsername`.
  updatedAt: string
}

// The draft state owned by `useRequestDraft` and consumed by the admin editor.
// Both features return this exact shape.
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
