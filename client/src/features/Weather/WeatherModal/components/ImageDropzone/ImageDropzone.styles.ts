import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'



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
