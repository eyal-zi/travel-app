import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import { DropPrompt, ImageFrame, WeatherImage } from './ImageDropzone.styles'

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
}: ImageDropzoneProps) => {
  const [preview, setPreview] = useState<string | null>(null)

  // Build an object-URL preview for the current file, revoking it whenever the
  // file changes or the component unmounts so we don't leak blobs. Clearing the
  // file (e.g. on modal reset) tears the preview down too.
  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const onDrop = useCallback(
    (accepted: File[]) => {
      const next = accepted[0]
      if (next) onFileChange(next)
    },
    [onFileChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  })

  // A freshly picked file wins; otherwise fall back to the existing remote
  // image. Either way the frame stays a drop target so it can be swapped out.
  const displayedSrc = preview ?? imageUrl

  if (displayedSrc) {
    return (
      <ImageFrame {...getRootProps()}>
        <input {...getInputProps()} />
        <WeatherImage src={displayedSrc} alt="Weather" />
      </ImageFrame>
    )
  }

  if (loading) {
    return (
      <ImageFrame>
        <CircularProgress />
      </ImageFrame>
    )
  }

  return (
    <DropPrompt {...getRootProps()} isDragActive={isDragActive}>
      <input {...getInputProps()} />
      <CloudUploadRoundedIcon />
      <Typography variant="body1">
        {isDragActive
          ? 'Drop the image to add it'
          : 'Drag an image here, or click to browse'}
      </Typography>
    </DropPrompt>
  )
}
