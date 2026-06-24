import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Notification } from '../../../../common/components/Notification/Notification'
import type { TripRequest } from '../../types'
import { STATUS_META } from '../TripRequestItem/statusMeta'
import { TripRequestAdminEditor } from './TripRequestAdminEditor'
import { TripRequestUserView } from './TripRequestUserView'
import { useTripRequestDraft } from './useTripRequestDraft'
import {
  DialogGoalTitle,
  DialogHeader,
  DialogTitleBar,
  StatusChip,
  StyledDialog,
  TitleColumn,
} from './TripRequestResponseDialog.styles'

type TripRequestResponseDialogProps = {
  open: boolean
  onClose: () => void
  request: TripRequest
  // When true, render the admin editor; otherwise the read-only user view.
  admin?: boolean
}

export const TripRequestResponseDialog = ({
  open,
  onClose,
  request,
  admin,
}: TripRequestResponseDialogProps) => {
  const draft = useTripRequestDraft(request, open)
  const { saving, canSave, save, notification, closeNotification } = draft
  const status = STATUS_META[request.status] ?? STATUS_META.received

  const handleSave = async () => {
    // The success snackbar lives outside the dialog, so it still shows after we
    // close on success.
    if (await save()) onClose()
  }

  return (
    <>
      <StyledDialog open={open} onClose={saving ? undefined : onClose} scroll="paper">
        <DialogTitleBar component="div">
          <DialogHeader>
            <TitleColumn>
              <DialogGoalTitle variant="h6">{request.tripGoal}</DialogGoalTitle>
              <StatusChip label={status.label} color={status.color} size="small" />
            </TitleColumn>
            <IconButton onClick={onClose} edge="end" aria-label="Close" disabled={saving}>
              <CloseRoundedIcon />
            </IconButton>
          </DialogHeader>
        </DialogTitleBar>

        <DialogContent dividers>
          {admin ? (
            <TripRequestAdminEditor request={request} draft={draft} />
          ) : (
            <TripRequestUserView request={request} />
          )}
        </DialogContent>

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

      <Notification notification={notification} onClose={closeNotification} />
    </>
  )
}
