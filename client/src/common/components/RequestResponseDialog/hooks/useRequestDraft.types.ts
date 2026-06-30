import type { RequestStatus } from '../../../requests/requestStatus'

// The async mutation functions a feature wires into `useRequestDraft`, sequenced
// inside its `save()`.
export type UpdateRequestAsync = (vars: {
  id: string
  status?: RequestStatus
  adminNote?: string
}) => Promise<unknown>
export type AddFileAsync = (vars: { id: string; file: File }) => Promise<unknown>
export type RemoveFileAsync = (vars: { id: string; fileId: string }) => Promise<unknown>

// Inputs to the shared `useRequestDraft` hook: the request it seeds from, the
// open flag, and the feature's mutation functions.
export type UseRequestDraftArgs = {
  request: { id: string; status: RequestStatus; adminNote: string | null }
  open: boolean
  updateRequestAsync: UpdateRequestAsync
  addFileAsync: AddFileAsync
  removeFileAsync: RemoveFileAsync
}
