import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import type { EventColor } from '../../Calendar.types'

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '100%',
    maxWidth: 440,
    borderRadius: (theme.shape.borderRadius as number) * 1.5,
    backgroundImage: 'none',
  },
}))

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  justifyContent: 'space-between',
  paddingInline: theme.spacing(3),
  paddingBottom: theme.spacing(2.5),
}))

export const DialogHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const FormStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
}))

export const DateRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  '& > *': {
    flex: '1 1 160px',
    minWidth: 0,
  },
}))

export const SwatchRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}))

export const Swatch = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'swatchColor' && prop !== 'selected',
})<{ swatchColor: EventColor; selected: boolean }>(({ theme, swatchColor, selected }) => ({
  width: 28,
  height: 28,
  borderRadius: '50%',
  backgroundColor: theme.palette[swatchColor].main,
  transition: theme.transitions.create(['transform', 'box-shadow']),
  transform: selected ? 'scale(1.12)' : 'scale(1)',
  boxShadow: selected
    ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette[swatchColor].main}`
    : 'none',
  '&:hover': {
    transform: 'scale(1.12)',
  },
}))
