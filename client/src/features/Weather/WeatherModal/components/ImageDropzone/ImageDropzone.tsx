import { FileDropzone } from '../../../../../common/components/FileDropzone/FileDropzone'
import { ImageFrame, WeatherImage } from './ImageDropzone.styles'
import type { ImageDropzoneProps } from './ImageDropzone.types'

export const ImageDropzone = ({
  file,
  onFileChange,
  imageUrl = null,
  loading = false,
  readOnly = false,
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
    readOnly={readOnly}
    renderPreview={(src) => (
      <ImageFrame>
        <WeatherImage src={src} alt="Weather" />
      </ImageFrame>
    )}
  />
)
