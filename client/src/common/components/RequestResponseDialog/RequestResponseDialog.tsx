import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Notification } from '../Notification/Notification'
import { REQUEST_STATUS_META } from '../../requests/requestStatus'
import { RequestAdminEditor } from './RequestAdminEditor'
import { RequestUserView } from './RequestUserView'
import type {
  RequestDraft,
  RequestSummary,
} from './RequestResponseDialog.types'
import {
  DialogGoalTitle,
  DialogHeader,
  DialogTitleBar,
  StatusChip,
  StyledDialog,
  TitleColumn,
} from './RequestResponseDialog.styles'

type RequestResponseDialogProps = {
  open: boolean
  onClose: () => void
  request: RequestSummary
  
  
  draft: RequestDraft
  
  admin?: boolean
}






export const RequestResponseDialog = ({
  open,
  onClose,
  request,
  draft,
  admin,
}: RequestResponseDialogProps) => {
  const { saving, canSave, save, notification, closeNotification } = draft
  const status = REQUEST_STATUS_META[request.status] ?? REQUEST_STATUS_META.received

  const handleSave = async () => {
    
    
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
            <RequestAdminEditor request={request} draft={draft} />
          ) : (
            <RequestUserView request={request} />
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
