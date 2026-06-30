import { useState } from 'react'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { FileDropzone } from '../../common/components/FileDropzone/FileDropzone'
import { Notification } from '../../common/components/Notification/Notification'
import { UploadedTag } from '../../common/components/UploadedTag/UploadedTag'
import { useNotification } from '../../common/hooks/useNotification'
import { useSelectedDate } from '../../common/hooks/useSelectedDate'
import { todayKey } from '../../common/utils/date'
import { useIsAdmin } from '../Auth/useIsAdmin'
import { PdfViewer } from './PdfViewer'
import { usePdfForDate, useSavePdf, useDeletePdf } from './queries/usePdf'
import { DeleteButton, PdfRoot } from './PdfDropzone.styles'

/**
 * Inline PDF dropzone: loads the PDF for the selected date (or the closest
 * preceding one) and uploads a dropped PDF straight away, persisting it through
 * React Query. Rendering is delegated to the shared `FileDropzone` and the
 * `PdfViewer` iframe.
 */
export const PdfDropzone = () => {
  const [selectedDate] = useSelectedDate()
  const date = selectedDate ?? todayKey()
  const canEdit = useIsAdmin()

  // The picked file drives the preview while the upload is in flight; afterwards
  // the cached record's signed URL takes over.
  const [file, setFile] = useState<File | null>(null)
  const { notification, notifyError, notifySuccess, close } = useNotification()

  const { data: record, isLoading } = usePdfForDate(date)
  const savePdf = useSavePdf()
  const deletePdf = useDeletePdf()

  const existingUrl = record?.signedUrl ?? null
  const uploadedAt = record?.date ?? null

  const handleFileChange = (next: File) => {
    setFile(next)
    savePdf.mutate(
      { date, file: next },
      {
        onSuccess: () => notifySuccess('PDF saved.'),
        onError: () => notifyError('Failed to save the PDF.'),
        onSettled: () => setFile(null),
      },
    )
  }

  const handleDelete = () => {
    deletePdf.mutate(date, {
      onSuccess: () => notifySuccess('PDF deleted.'),
      onError: () => notifyError('Failed to delete the PDF.'),
    })
  }

  return (
    <PdfRoot>
      <UploadedTag date={uploadedAt} />
      {existingUrl && !file && canEdit && (
        <DeleteButton
          onClick={handleDelete}
          disabled={deletePdf.isPending}
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
        loading={isLoading}
        accept={{ 'application/pdf': ['.pdf'] }}
        idlePrompt="Drag a PDF here, or click to browse"
        activePrompt="Drop the PDF to add it"
        readOnly={!canEdit}
        renderPreview={(src) => <PdfViewer url={src} />}
      />

      <Notification notification={notification} onClose={close} />
    </PdfRoot>
  )
}
