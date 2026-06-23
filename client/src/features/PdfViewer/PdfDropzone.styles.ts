import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// Positioning context so the date label and delete control can overlay the
// PDF, which fills it.
export const PdfRoot = styled(Box)({
  position: 'relative',
  flex: 1,
  width: '100%',
  minHeight: 0,
  display: 'flex',
})

export const UploadedTitle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  left: theme.spacing(1.5),
  zIndex: 1,
  pointerEvents: 'none',
  padding: theme.spacing(0.5, 1.25),
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  color: theme.palette.text.secondary,
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
}))

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  '&:hover': { backgroundColor: theme.palette.action.hover },
}))
