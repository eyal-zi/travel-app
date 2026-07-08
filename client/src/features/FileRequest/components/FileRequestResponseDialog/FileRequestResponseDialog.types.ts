import type { Notification } from '../../../../common/hooks/useNotification'
import type { RequestStatus } from '../../../../common/requests/requestStatus'
import type { GeoLayer } from '../../../../common/geo/geo.types'
import type { FileRequest } from '../../types'





export type FileRequestResponseDraft = {
  statusDraft: RequestStatus
  note: string
  name: string
  
  
  fileType: string
  accuracy: number
  country: string
  coverageDate: Date | null
  file: File | null
  saving: boolean
  
  uploadProgress: number | null
  canSave: boolean
  setStatus: (status: RequestStatus) => void
  setNote: (note: string) => void
  setName: (name: string) => void
  setFileType: (value: string) => void
  setAccuracy: (value: number) => void
  setCountry: (value: string) => void
  setCoverageDate: (value: Date | null) => void
  setAreaLayers: (layers: GeoLayer[]) => void
  setFile: (file: File) => void
  
  clearFile: () => void
  submit: () => Promise<boolean>
  notification: Notification | null
  closeNotification: () => void
}

export type FileRequestResponseDialogProps = {
  open: boolean
  onClose: () => void
  request: FileRequest
  draft: FileRequestResponseDraft
  
  admin?: boolean
}
