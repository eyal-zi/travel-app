import type { Notification } from '../../hooks/useNotification'
import type { RequestStatus } from '../../requests/requestStatus'


export type RequestFile = {
  id: string
  fileName: string
  contentType: string
  signedUrl: string
}



export type RequestSummary = {
  id: string
  tripGoal: string
  status: RequestStatus
  adminNote: string | null
  
  
  files?: RequestFile[]
  
  
  createdByUsername: string | null
  updatedByUsername: string | null
  
  updatedAt: string
}



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
