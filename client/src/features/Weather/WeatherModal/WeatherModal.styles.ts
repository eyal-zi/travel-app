import { styled } from '@mui/material/styles'
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

export const ImageFrame = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 480,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: theme.palette.action.hover,
}))

export const WeatherImage = styled('img')({
  width: '100%',
  display: 'block',
  objectFit: 'cover',
})
