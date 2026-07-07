import type { Notification } from '../../../../common/hooks/useNotification'
import type { RequestStatus } from '../../../../common/requests/requestStatus'
import type { GeoLayer } from '../../../../common/geo/geo.types'
import type { FileRequest } from '../../types'

// The admin response draft: the workflow status/note plus the full large-file
// form the admin fills to fulfil the request. Owned by `useFileRequestResponseDraft`
// and consumed by the dialog's admin form. `submit()` uploads the file + metadata
// and returns whether it succeeded so the dialog can close.
export type FileRequestResponseDraft = {
  statusDraft: RequestStatus
  note: string
  name: string
  // The file type of the fulfilling file: a fixed option value or an arbitrary
  // custom value typed into the autocomplete (freeSolo).
  fileType: string
  accuracy: number
  country: string
  coverageDate: Date | null
  file: File | null
  saving: boolean
  // Direct-to-S3 upload progress in [0, 1] while the file uploads, else null.
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
  // Removes the picked file so the dropzone reappears.
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
  // When true, render the admin large-file form; otherwise the requester view.
  admin?: boolean
}
