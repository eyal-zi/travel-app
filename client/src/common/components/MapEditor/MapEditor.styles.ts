import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const DropzoneRoot = styled(Box)({
  position: 'relative',
  height: '100%',
  width: '100%',
  minHeight: 0,
})

export const DragOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: 1000,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  border: `2px dashed ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.action.hover,
  color: theme.palette.primary.main,
  font: 'inherit',
  fontWeight: theme.typography.fontWeightMedium,
}))
