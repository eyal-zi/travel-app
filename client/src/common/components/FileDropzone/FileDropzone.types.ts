import type { ReactNode } from 'react'
import type { Accept } from 'react-dropzone'

export type FileDropzoneProps = {
  file: File | null
  onFileChange: (file: File) => void
  // Existing remote file (signed URL) to show when no new file has been picked.
  fileUrl?: string | null
  // Hides the empty prompt while the existing file is still being fetched.
  loading?: boolean
  // react-dropzone accept map, e.g. { 'image/*': [] } or { 'application/pdf': ['.pdf'] }.
  accept: Accept
  // Optional fixed height for the empty/loading states; omit to fill the parent.
  minHeight?: number
  idlePrompt?: string
  activePrompt?: string
  // When true, render watch-only: no click/drag upload affordance — just the
  // preview, or a passive placeholder when there's no file.
  readOnly?: boolean
  // Renders the picked/existing file. `src` is the object-URL preview when a new
  // file is selected, otherwise the existing remote URL.
  renderPreview: (src: string) => ReactNode
}
