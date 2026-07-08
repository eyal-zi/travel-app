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
  readOnly = false,
  renderPreview,
}: FileDropzoneProps) => {
  const [preview, setPreview] = useState<string | null>(null)

  
  
  
  
  useEffect(() => {
    const url = file ? URL.createObjectURL(file) : null
    
    setPreview(url)
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
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

  
  const displayedSrc = preview ?? fileUrl

  
  
  
  return displayedSrc ? (
    readOnly ? (
      <PreviewFrame minHeight={minHeight}>{renderPreview(displayedSrc)}</PreviewFrame>
    ) : (
      <PreviewFrame {...getRootProps()} minHeight={minHeight}>
        <input {...getInputProps()} />
        {renderPreview(displayedSrc)}
      </PreviewFrame>
    )
  ) : loading ? (
    <LoadingFrame minHeight={minHeight}>
      <CircularProgress />
    </LoadingFrame>
  ) : readOnly ? (
    <DropPrompt isDragActive={false} minHeight={minHeight}>
      <Typography variant="body1">Nothing to show yet</Typography>
    </DropPrompt>
  ) : (
    <DropPrompt {...getRootProps()} isDragActive={isDragActive} minHeight={minHeight}>
      <input {...getInputProps()} />
      <CloudUploadRoundedIcon />
      <Typography variant="body1">{isDragActive ? activePrompt : idlePrompt}</Typography>
    </DropPrompt>
  )
}
