import type { RequestStatus } from '../../../requests/requestStatus'



export type UpdateRequestAsync = (vars: {
  id: string
  status?: RequestStatus
  adminNote?: string
}) => Promise<unknown>
export type AddFileAsync = (vars: { id: string; file: File }) => Promise<unknown>
export type RemoveFileAsync = (vars: { id: string; fileId: string }) => Promise<unknown>



export type UseRequestDraftArgs = {
  request: { id: string; status: RequestStatus; adminNote: string | null }
  open: boolean
  updateRequestAsync: UpdateRequestAsync
  addFileAsync: AddFileAsync
  removeFileAsync: RemoveFileAsync
}
