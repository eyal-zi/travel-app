import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: 960,
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    backgroundImage: 'none',
  },
}))

export const DialogHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

// Positioning context so the "uploaded for" tag can overlay the image's
// top-left corner.
export const DropzoneWrapper = styled(Box)({
  position: 'relative',
})

// Destructive action pushed to the far left of the dialog actions, away from
// Cancel/Save.
export const DeleteButton = styled(Button)(({ theme }) => ({
  marginRight: 'auto',
  color: theme.palette.error.main,
}))
