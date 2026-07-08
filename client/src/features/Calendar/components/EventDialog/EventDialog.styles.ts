import { styled, alpha } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import type { EventStyle } from '../../Calendar.types'
import { isColorStyle } from '../../eventStyles'

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
  shouldForwardProp: (prop) => prop !== 'swatchStyle' && prop !== 'selected',
})<{ swatchStyle: EventStyle; selected: boolean }>(({ theme, swatchStyle, selected }) => {
  
  
  const fill = isColorStyle(swatchStyle)
    ? theme.palette[swatchStyle].main
    : alpha(theme.palette.text.primary, 0.12)
  const ring = isColorStyle(swatchStyle)
    ? theme.palette[swatchStyle].main
    : theme.palette.text.primary
  return {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: fill,
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transitions.create(['transform', 'box-shadow']),
    transform: selected ? 'scale(1.12)' : 'scale(1)',
    boxShadow: selected
      ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${ring}`
      : 'none',
    '& svg': {
      fontSize: 17,
    },
    '&:hover': {
      transform: 'scale(1.12)',
    },
  }
})
