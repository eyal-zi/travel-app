import { useState } from 'react'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { FileDropzone } from '../../common/components/FileDropzone/FileDropzone'
import { Notification } from '../../common/components/Notification/Notification'
import { SaveCancelBar } from '../../common/components/SaveCancelBar/SaveCancelBar'
import { UploadedTag } from '../../common/components/UploadedTag/UploadedTag'
import { useNotification } from '../../common/hooks/useNotification'
import { useSelectedDate } from '../../common/hooks/useSelectedDate'
import { todayKey } from '../../common/utils/date'
import { useIsAdmin } from '../Auth/hooks/useIsAdmin'
import { PdfViewer } from './PdfViewer'
import { usePdfForDate, useSavePdf, useDeletePdf } from './queries/usePdf'
import { DeleteButton, PdfRoot } from './PdfDropzone.styles'







export const PdfDropzone = () => {
  const [selectedDate] = useSelectedDate()
  const date = selectedDate ?? todayKey()
  const canEdit = useIsAdmin()

  
  
  const [file, setFile] = useState<File | null>(null)
  const { notification, notifyError, notifySuccess, close } = useNotification()

  const { data: record, isLoading } = usePdfForDate(date)
  const savePdf = useSavePdf()
  const deletePdf = useDeletePdf()

  const existingUrl = record?.signedUrl ?? null
  const uploadedAt = record?.date ?? null


  const handleFileChange = (next: File) => {
    setFile(next)
  }


  const handleSave = () => {
    if (!file) return
    savePdf.mutate(
      { date, file },
      {
        onSuccess: () => {
          notifySuccess('PDF saved.')
          setFile(null)
        },
        onError: () => notifyError('Failed to save the PDF.'),
      },
    )
  }


  const handleCancel = () => {
    setFile(null)
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

      {canEdit && file && (
        <SaveCancelBar
          onSave={handleSave}
          onCancel={handleCancel}
          saving={savePdf.isPending}
        />
      )}

      <Notification notification={notification} onClose={close} />
    </PdfRoot>
  )
}
