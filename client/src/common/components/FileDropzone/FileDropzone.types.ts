import type { ReactNode } from 'react'
import type { Accept } from 'react-dropzone'

export type FileDropzoneProps = {
  file: File | null
  onFileChange: (file: File) => void
  
  fileUrl?: string | null
  
  loading?: boolean
  
  accept: Accept
  
  minHeight?: number
  idlePrompt?: string
  activePrompt?: string
  
  
  readOnly?: boolean
  
  
  renderPreview: (src: string) => ReactNode
}
