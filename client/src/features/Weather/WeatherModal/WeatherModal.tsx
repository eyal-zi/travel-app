import { useState } from 'react'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Notification } from '../../../common/components/Notification/Notification'
import { UploadedTag } from '../../../common/components/UploadedTag/UploadedTag'
import { useNotification } from '../../../common/hooks/useNotification'
import { useSelectedDate } from '../../../common/hooks/useSelectedDate'
import { todayKey } from '../../../common/utils/date'
import {
  useWeatherForDate,
  useSaveWeather,
  useDeleteWeather,
} from '../queries/useWeather'
import { useIsAdmin } from '../../Auth/hooks/useIsAdmin'
import { ImageDropzone } from './components/ImageDropzone/ImageDropzone'
import {
  DeleteButton,
  DialogHeader,
  DropzoneWrapper,
  StyledDialog,
} from './WeatherModal.styles'

type WeatherModalProps = {
  open: boolean
  onClose: () => void
}

export const WeatherModal = ({ open, onClose }: WeatherModalProps) => {
  const [selectedDate] = useSelectedDate()
  const date = selectedDate ?? todayKey()
  const canEdit = useIsAdmin()

  const [file, setFile] = useState<File | null>(null)
  const { notification, notifyError, notifySuccess, close } = useNotification()

  // Load the saved image only while the modal is open.
  const { data: record, isLoading } = useWeatherForDate(date, open)
  const saveWeather = useSaveWeather()
  const deleteWeather = useDeleteWeather()

  const existingUrl = record?.signedUrl ?? null
  // The date the shown image was actually uploaded for; may be a closest-
  // preceding fallback rather than the selected date.
  const uploadedAt = record?.date ?? null
  const busy = saveWeather.isPending || deleteWeather.isPending

  // Clear the staged file once the close animation finishes; the saved image is
  // re-read from cache when the modal reopens.
  const handleExited = () => setFile(null)

  const handleSave = () => {
    if (!file) return
    saveWeather.mutate(
      { date, image: file },
      {
        onSuccess: () => {
          setFile(null)
          notifySuccess('Weather image saved.')
        },
        onError: () => notifyError('Failed to save the weather image.'),
      },
    )
  }

  const handleDelete = () => {
    deleteWeather.mutate(date, {
      onSuccess: () => notifySuccess('Weather image deleted.'),
      onError: () => notifyError('Failed to delete the weather image.'),
    })
  }

  return (
    <>
      <StyledDialog
        open={open}
        onClose={onClose}
        slotProps={{ transition: { onExited: handleExited } }}
      >
        <DialogTitle component="div">
          <DialogHeader>
            <Typography variant="h5">Weather</Typography>
            <IconButton onClick={onClose} edge="end" aria-label="Close">
              <CloseRoundedIcon />
            </IconButton>
          </DialogHeader>
        </DialogTitle>

        <DialogContent>
          <DropzoneWrapper>
            <UploadedTag date={uploadedAt} />
            <ImageDropzone
              file={file}
              onFileChange={setFile}
              imageUrl={existingUrl}
              loading={isLoading}
              readOnly={!canEdit}
            />
          </DropzoneWrapper>
        </DialogContent>

        <DialogActions>
          {existingUrl && canEdit && (
            <DeleteButton onClick={handleDelete} disabled={busy}>
              {deleteWeather.isPending ? 'Deleting…' : 'Delete'}
            </DeleteButton>
          )}
          <Button onClick={onClose} color="inherit" disabled={busy}>
            {canEdit ? 'Cancel' : 'Close'}
          </Button>
          {canEdit && (
            <Button variant="contained" onClick={handleSave} disabled={!file || busy}>
              {saveWeather.isPending ? 'Saving…' : 'Save'}
            </Button>
          )}
        </DialogActions>
      </StyledDialog>

      <Notification notification={notification} onClose={close} />
    </>
  )
}
