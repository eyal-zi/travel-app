export type ImageDropzoneProps = {
  file: File | null
  onFileChange: (file: File) => void
  
  imageUrl?: string | null
  
  loading?: boolean
  
  readOnly?: boolean
}
