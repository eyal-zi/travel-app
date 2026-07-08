import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { Bar, CancelButton, SaveButton } from './SaveCancelBar.styles'
import type { SaveCancelBarProps } from './SaveCancelBar.types'







export const SaveCancelBar = ({
  onSave,
  onCancel,
  saving = false,
  disabled = false,
  saveLabel = 'Save',
  savingLabel = 'Saving…',
  cancelLabel = 'Cancel',
  zIndex = 1000,
}: SaveCancelBarProps) => (
  <Bar zIndex={zIndex}>
    <SaveButton
      variant="contained"
      size="small"
      startIcon={<CheckRoundedIcon />}
      onClick={onSave}
      disabled={saving || disabled}
    >
      {saving ? savingLabel : saveLabel}
    </SaveButton>
    <CancelButton
      variant="text"
      color="inherit"
      size="small"
      startIcon={<CloseRoundedIcon />}
      onClick={onCancel}
      disabled={saving || disabled}
    >
      {cancelLabel}
    </CancelButton>
  </Bar>
)
