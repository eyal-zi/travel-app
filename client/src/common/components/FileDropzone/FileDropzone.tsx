import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import { DropPrompt, LoadingFrame, PreviewFrame } from './FileDropzone.styles'
import type { FileDropzoneProps } from './FileDropzone.types'

export const FileDropzone = ({
  file,
  onFileChange,
  fileUrl = null,
  loading = false,
  accept,
  minHeight,
  idlePrompt = 'Drag a file here, or click to browse',
  activePrompt = 'Drop the file to add it',
  renderPreview,
}: FileDropzoneProps) => {
  const [preview, setPreview] = useState<string | null>(null)

  // Build an object-URL preview for the current file, revoking it whenever the
  // file changes or the component unmounts so we don't leak blobs. Clearing the
  // file (e.g. on reset) tears the preview down too.
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
    accept,
    multiple: false,
  })

  // A freshly picked file wins; otherwise fall back to the existing remote file.
  // Either way the frame stays a drop target so it can be swapped out.
  const displayedSrc = preview ?? fileUrl

  if (displayedSrc) {
    return (
      <PreviewFrame {...getRootProps()} minHeight={minHeight}>
        <input {...getInputProps()} />
        {renderPreview(displayedSrc)}
      </PreviewFrame>
    )
  }

  if (loading) {
    return (
      <LoadingFrame minHeight={minHeight}>
        <CircularProgress />
      </LoadingFrame>
    )
  }

  return (
    <DropPrompt
      {...getRootProps()}
      isDragActive={isDragActive}
      minHeight={minHeight}
    >
      <input {...getInputProps()} />
      <CloudUploadRoundedIcon />
      <Typography variant="body1">
        {isDragActive ? activePrompt : idlePrompt}
      </Typography>
    </DropPrompt>
  )
}
