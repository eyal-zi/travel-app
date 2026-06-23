import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import UndoRoundedIcon from '@mui/icons-material/UndoRounded'
import { FileDropzone } from '../../../../common/components/FileDropzone/FileDropzone'
import { TRIP_REQUEST_STATUSES, type TripRequest } from '../../types'
import { useUpdateTripRequest } from '../../queries/useUpdateTripRequest'
import { useTripRequestFiles } from '../../queries/useTripRequestFiles'
import { STATUS_META } from '../TripRequestItem/statusMeta'
import {
  DialogHeader,
  EmptyState,
  FileCard,
  FileIconBadge,
  FileRow,
  NoteCard,
  Section,
  StyledDialog,
} from './TripRequestResponseDialog.styles'

type TripRequestResponseDialogProps = {
  open: boolean
  onClose: () => void
  request: TripRequest
  // When true, render the admin editor; otherwise the read-only user view.
  admin?: boolean
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant="overline"
    color="text.secondary"
    sx={{ letterSpacing: 0.6, fontWeight: 700 }}
  >
    {children}
  </Typography>
)

export const TripRequestResponseDialog = ({
  open,
  onClose,
  request,
  admin,
}: TripRequestResponseDialogProps) => {
  const { updateRequestAsync } = useUpdateTripRequest()
  const { addFileAsync, removeFileAsync } = useTripRequestFiles()

  const [statusDraft, setStatusDraft] = useState(request.status)
  const [noteDraft, setNoteDraft] = useState(request.adminNote ?? '')
  // Files chosen but not yet uploaded, and existing files marked for deletion —
  // both only take effect on Save.
  const [stagedFiles, setStagedFiles] = useState<File[]>([])
  const [removedFileIds, setRemovedFileIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Reseed the editor each time the dialog transitions to open so it reflects the
  // latest saved state and drops any abandoned staged edits. Adjusting state
  // during render is the React-recommended alternative to an effect here.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) {
      setStatusDraft(request.status)
      setNoteDraft(request.adminNote ?? '')
      setStagedFiles([])
      setRemovedFileIds([])
    }
  }

  const status = STATUS_META[request.status] ?? STATUS_META.received
  const hasNote = Boolean(request.adminNote)

  const statusDirty = statusDraft !== request.status
  const noteDirty = noteDraft !== (request.adminNote ?? '')
  const filesDirty = stagedFiles.length > 0 || removedFileIds.length > 0
  const canSave = statusDirty || noteDirty || filesDirty

  const toggleRemoveExisting = (fileId: string) =>
    setRemovedFileIds((ids) =>
      ids.includes(fileId)
        ? ids.filter((id) => id !== fileId)
        : [...ids, fileId],
    )

  const unstageFile = (index: number) =>
    setStagedFiles((files) => files.filter((_, i) => i !== index))

  const handleSave = async () => {
    setSaving(true)
    try {
      if (statusDirty || noteDirty) {
        await updateRequestAsync({
          id: request.id,
          ...(statusDirty && { status: statusDraft }),
          ...(noteDirty && { adminNote: noteDraft }),
        })
      }
      for (const fileId of removedFileIds) {
        await removeFileAsync({ id: request.id, fileId })
      }
      for (const file of stagedFiles) {
        await addFileAsync({ id: request.id, file })
      }
      // The refetched request now carries the changes; clear the staging area
      // and close. The success snackbar lives outside the dialog, so it still
      // shows after closing.
      setStagedFiles([])
      setRemovedFileIds([])
      setSuccess(true)
      onClose()
    } catch {
      setError('Could not save your changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Read-only view shown to requesters: a framed response note and downloadable
  // file tiles.
  const userView = (
    <Section sx={{ gap: 3 }}>
      <Section>
        <SectionLabel>Response</SectionLabel>
        {hasNote ? (
          <NoteCard>
            <Typography
              variant="body2"
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 }}
            >
              {request.adminNote}
            </Typography>
          </NoteCard>
        ) : (
          <EmptyState>
            <ChatBubbleOutlineRoundedIcon />
            <Typography variant="body2">No response yet</Typography>
            <Typography variant="caption">
              You'll see a message here once it's ready.
            </Typography>
          </EmptyState>
        )}
      </Section>

      <Section>
        <SectionLabel>
          Attachments{request.files.length > 0 ? ` · ${request.files.length}` : ''}
        </SectionLabel>
        {request.files.length > 0 ? (
          request.files.map((file) => (
            <FileCard
              key={file.id}
              component="a"
              href={file.signedUrl}
              target="_blank"
              rel="noopener"
            >
              <FileIconBadge>
                <DescriptionRoundedIcon />
              </FileIconBadge>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ wordBreak: 'break-all' }}
                >
                  {file.fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Click to download
                </Typography>
              </Box>
              <DownloadRoundedIcon sx={{ color: 'primary.main' }} />
            </FileCard>
          ))
        ) : (
          <EmptyState>
            <FolderOpenRoundedIcon />
            <Typography variant="body2">No files attached</Typography>
          </EmptyState>
        )}
      </Section>
    </Section>
  )

  // Editor shown to admins: status transitions, an editable note, and staged
  // file add/remove committed on Save.
  const adminView = (
    <Section sx={{ gap: 2 }}>
      <Section>
        <SectionLabel>Status</SectionLabel>
        <ToggleButtonGroup
          exclusive
          fullWidth
          size="small"
          value={statusDraft}
          disabled={saving}
          onChange={(_event, value) => {
            if (value) setStatusDraft(value)
          }}
        >
          {TRIP_REQUEST_STATUSES.map((value) => {
            const meta = STATUS_META[value]
            return (
              <ToggleButton
                key={value}
                value={value}
                sx={{
                  fontWeight: 600,
                  '&.Mui-selected, &.Mui-selected:hover': {
                    color: `${meta.color}.contrastText`,
                    backgroundColor: `${meta.color}.main`,
                  },
                }}
              >
                {meta.label}
              </ToggleButton>
            )
          })}
        </ToggleButtonGroup>
      </Section>

      <Section>
        <SectionLabel>Response</SectionLabel>
        <TextField
          multiline
          minRows={3}
          maxRows={6}
          size="small"
          fullWidth
          placeholder="Write a note for the requester… (leave empty to remove it)"
          value={noteDraft}
          disabled={saving}
          onChange={(event) => setNoteDraft(event.target.value)}
        />
      </Section>

      <Divider />

      <Section>
        <SectionLabel>Attachments</SectionLabel>

        {request.files.length === 0 && stagedFiles.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No files attached.
          </Typography>
        )}

        {request.files.map((file) => {
          const markedForRemoval = removedFileIds.includes(file.id)
          return (
            <FileRow key={file.id}>
              <AttachFileRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Link
                href={file.signedUrl}
                target="_blank"
                rel="noopener"
                variant="body2"
                sx={{
                  flex: 1,
                  wordBreak: 'break-all',
                  ...(markedForRemoval && {
                    textDecoration: 'line-through',
                    color: 'text.disabled',
                  }),
                }}
              >
                {file.fileName}
              </Link>
              <IconButton
                size="small"
                aria-label={
                  markedForRemoval ? `Keep ${file.fileName}` : `Remove ${file.fileName}`
                }
                disabled={saving}
                onClick={() => toggleRemoveExisting(file.id)}
              >
                {markedForRemoval ? (
                  <UndoRoundedIcon sx={{ fontSize: 16 }} />
                ) : (
                  <CloseRoundedIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </FileRow>
          )
        })}

        {/* Newly chosen files, pending upload on Save */}
        {stagedFiles.map((file, index) => (
          <FileRow key={`staged-${index}`}>
            <AttachFileRoundedIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-all' }}>
              {file.name}{' '}
              <Typography component="span" variant="caption" color="primary">
                (new)
              </Typography>
            </Typography>
            <IconButton
              size="small"
              aria-label={`Remove ${file.name}`}
              disabled={saving}
              onClick={() => unstageFile(index)}
            >
              <CloseRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </FileRow>
        ))}

        <FileDropzone
          file={null}
          onFileChange={(file) => setStagedFiles((files) => [...files, file])}
          accept={{}}
          minHeight={90}
          idlePrompt="Drag a file here, or click to browse"
          renderPreview={() => null}
        />
      </Section>
    </Section>
  )

  return (
    <>
      <StyledDialog open={open} onClose={saving ? undefined : onClose} scroll="paper">
        <DialogTitle component="div" sx={{ pb: 1.5 }}>
          <DialogHeader>
            <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography variant="h6" sx={{ wordBreak: 'break-word', lineHeight: 1.3 }}>
                {request.tripGoal}
              </Typography>
              <Chip
                label={status.label}
                color={status.color}
                size="small"
                sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
              />
            </Box>
            <IconButton onClick={onClose} edge="end" aria-label="Close" disabled={saving}>
              <CloseRoundedIcon />
            </IconButton>
          </DialogHeader>
        </DialogTitle>

        <DialogContent dividers>{admin ? adminView : userView}</DialogContent>

        {admin && (
          <DialogActions>
            <Button onClick={onClose} color="inherit" disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!canSave || saving}
              startIcon={
                saving ? <CircularProgress size={14} color="inherit" /> : undefined
              }
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        )}
      </StyledDialog>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSuccess(false)}>
          Changes saved.
        </Alert>
      </Snackbar>
    </>
  )
}
