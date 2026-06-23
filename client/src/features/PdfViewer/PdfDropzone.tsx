import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { FileDropzone } from '../../common/components/FileDropzone/FileDropzone'
import { useSelectedDate } from '../../common/hooks/useSelectedDate'
import { PdfViewer } from './PdfViewer'
import { pdfService } from './pdfService'
import { DeleteButton, PdfRoot, UploadedTitle } from './PdfDropzone.styles'

/**
 * Inline PDF dropzone: loads the PDF for the selected date (or the closest
 * preceding one) and uploads a dropped PDF straight away, persisting it through
 * `pdfService`. Rendering is delegated to the shared `FileDropzone` and the
 * `PdfViewer` iframe.
 */
export const PdfDropzone = () => {
  const [selectedDate] = useSelectedDate()
  const [file, setFile] = useState<File | null>(null)
  const [existingUrl, setExistingUrl] = useState<string | null>(null)
  const [uploadedAt, setUploadedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const date = selectedDate ?? format(new Date(), 'yyyy-MM-dd')

  // Load the PDF for the date whenever it changes. The `active` guard drops a
  // stale response if the date changes again before the request resolves.
  useEffect(() => {
    let active = true
    setLoading(true)
    pdfService
      .getClosest(date)
      .then((record) => {
        if (!active) return
        setExistingUrl(record?.signedUrl ?? null)
        setUploadedAt(record?.date ?? null)
        setFile(null)
      })
      .catch(() => {
        if (active) setError('Failed to load the PDF for this date.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [date])

  // Dropping a PDF uploads it immediately; the picked file drives the preview
  // while the request is in flight, then we swap to the stored signed URL.
  const handleFileChange = async (next: File) => {
    setFile(next)
    try {
      const { data } = await pdfService.create(date, next)
      setExistingUrl(data.signedUrl)
      setUploadedAt(data.date)
      setSuccess('PDF saved.')
    } catch {
      setError('Failed to save the PDF.')
    } finally {
      setFile(null)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await pdfService.removeByDate(date)
      // Clear locally instead of refetching so the dropzone goes straight back
      // to its empty state.
      setExistingUrl(null)
      setUploadedAt(null)
      setSuccess('PDF deleted.')
    } catch {
      setError('Failed to delete the PDF.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <PdfRoot>
      {uploadedAt && (
        <UploadedTitle>
          Uploaded for {format(new Date(uploadedAt), 'PP')}
        </UploadedTitle>
      )}
      {existingUrl && !file && (
        <DeleteButton
          onClick={handleDelete}
          disabled={deleting}
          size="small"
          aria-label="Delete PDF"
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </DeleteButton>
      )}

      <FileDropzone
        file={file}
        onFileChange={handleFileChange}
        fileUrl={existingUrl}
        loading={loading}
        accept={{ 'application/pdf': ['.pdf'] }}
        idlePrompt="Drag a PDF here, or click to browse"
        activePrompt="Drop the PDF to add it"
        renderPreview={(src) => <PdfViewer url={src} />}
      />

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccess(null)}
        >
          {success}
        </Alert>
      </Snackbar>
    </PdfRoot>
  )
}
