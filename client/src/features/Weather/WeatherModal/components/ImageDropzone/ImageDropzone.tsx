import { FileDropzone } from '../../../../../common/components/FileDropzone/FileDropzone'
import { ImageFrame, WeatherImage } from './ImageDropzone.styles'

type ImageDropzoneProps = {
  file: File | null
  onFileChange: (file: File) => void
  // Existing remote image to show when no new file has been picked yet.
  imageUrl?: string | null
  // Hides the empty prompt while the existing image is still being fetched.
  loading?: boolean
}

export const ImageDropzone = ({
  file,
  onFileChange,
  imageUrl = null,
  loading = false,
}: ImageDropzoneProps) => (
  <FileDropzone
    file={file}
    onFileChange={onFileChange}
    fileUrl={imageUrl}
    loading={loading}
    accept={{ 'image/*': [] }}
    minHeight={480}
    idlePrompt="Drag an image here, or click to browse"
    activePrompt="Drop the image to add it"
    renderPreview={(src) => (
      <ImageFrame>
        <WeatherImage src={src} alt="Weather" />
      </ImageFrame>
    )}
  />
)
