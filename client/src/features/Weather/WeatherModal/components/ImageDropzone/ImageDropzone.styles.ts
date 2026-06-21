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

// Empty-state drop target shown before an image is selected. `isDragActive`
// drives the hover styling while a file is dragged over the modal.
export const DropPrompt = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragActive',
})<{ isDragActive: boolean }>(({ theme, isDragActive }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  width: '100%',
  height: '100%',
  minHeight: 480,
  padding: theme.spacing(4),
  cursor: 'pointer',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  border: `2px dashed ${
    isDragActive ? theme.palette.primary.main : theme.palette.divider
  }`,
  borderRadius: 12,
  backgroundColor: isDragActive
    ? theme.palette.action.hover
    : 'transparent',
  transition: theme.transitions.create(['border-color', 'background-color'], {
    duration: theme.transitions.duration.shorter,
  }),
  '& svg': { fontSize: 48 },
}))
