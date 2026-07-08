import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { ActionButton, Bar, CancelButton } from './ConfirmBar.styles'
import type { ConfirmBarProps } from './ConfirmBar.types'







export const ConfirmBar = ({
  onAction,
  onCancel,
  busy = false,
  disabled = false,
  actionLabel = 'Save',
  busyLabel = 'Saving…',
  cancelLabel = 'Cancel',
  actionIcon = <CheckRoundedIcon />,
  cancelIcon = <CloseRoundedIcon />,
  actionColor = 'primary',
  placement = 'bottom',
  zIndex = 1000,
}: ConfirmBarProps) => (
  <Bar zIndex={zIndex} placement={placement}>
    <ActionButton
      variant="contained"
      color={actionColor}
      size="small"
      startIcon={actionIcon}
      onClick={onAction}
      disabled={busy || disabled}
    >
      {busy ? busyLabel : actionLabel}
    </ActionButton>
    <CancelButton
      variant="text"
      color="inherit"
      size="small"
      startIcon={cancelIcon}
      onClick={onCancel}
      disabled={busy || disabled}
    >
      {cancelLabel}
    </CancelButton>
  </Bar>
)
