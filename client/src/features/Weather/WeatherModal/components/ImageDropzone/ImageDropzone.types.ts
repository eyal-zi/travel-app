export type ImageDropzoneProps = {
  file: File | null
  onFileChange: (file: File) => void
  // Existing remote image to show when no new file has been picked yet.
  imageUrl?: string | null
  // Hides the empty prompt while the existing image is still being fetched.
  loading?: boolean
  // Watch-only: show the image without the upload affordance.
  readOnly?: boolean
}
