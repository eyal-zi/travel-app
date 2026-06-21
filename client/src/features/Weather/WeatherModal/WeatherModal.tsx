import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useSelectedDate } from '../../../common/hooks/useSelectedDate'
import { weatherService } from '../weatherService'
import { ImageDropzone } from './components/ImageDropzone/ImageDropzone'
import { DeleteButton, DialogHeader, StyledDialog } from './WeatherModal.styles'

type WeatherModalProps = {
  open: boolean
  onClose: () => void
}

export const WeatherModal = ({ open, onClose }: WeatherModalProps) => {
  const [selectedDate] = useSelectedDate()
  const [file, setFile] = useState<File | null>(null)
  const [existingUrl, setExistingUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const busy = saving || deleting

  const date = selectedDate ?? format(new Date(), 'yyyy-MM-dd')

  // Load any already-saved image for the date whenever the modal opens. The
  // `active` guard drops a stale response if the modal is closed (or the date
  // changes) before the request resolves.
  useEffect(() => {
    if (!open) return

    let active = true
    setLoading(true)
    weatherService
      .getByDate(date)
      .then((record) => {
        if (active) setExistingUrl(record?.signedUrl ?? null)
      })
      .catch(() => {
        if (active) setError('Failed to load the weather image.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [open, date])

  // Reset to an empty dropzone once the close animation finishes.
  const handleExited = () => {
    setFile(null)
    setExistingUrl(null)
    setSaving(false)
    setDeleting(false)
  }

  const handleSave = async () => {
    if (!file) return
    setSaving(true)
    try {
      const { data } = await weatherService.create(date, file)
      setExistingUrl(data.signedUrl)
      setFile(null)
      setSuccess('Weather image saved.')
    } catch {
      setError('Failed to save the weather image.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await weatherService.remove(date)
      setExistingUrl(null)
      setFile(null)
      setSuccess('Weather image deleted.')
    } catch {
      setError('Failed to delete the weather image.')
    } finally {
      setDeleting(false)
    }
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
          <ImageDropzone
            file={file}
            onFileChange={setFile}
            imageUrl={existingUrl}
            loading={loading}
          />
        </DialogContent>

        <DialogActions>
          {existingUrl && (
            <DeleteButton onClick={handleDelete} disabled={busy}>
              {deleting ? 'Deleting…' : 'Delete'}
            </DeleteButton>
          )}
          <Button onClick={onClose} color="inherit" disabled={busy}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!file || busy}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </StyledDialog>

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
    </>
  )
}
