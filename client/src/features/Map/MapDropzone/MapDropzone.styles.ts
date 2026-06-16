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
  backdropFilter: 'blur(1px)',
  color: theme.palette.primary.main,
  font: 'inherit',
  fontWeight: theme.typography.fontWeightMedium,
}))

export const LayerPanel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  minWidth: 200,
  maxWidth: 280,
  overflow: 'hidden',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[6],
}))

export const ActionBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2.5),
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75),
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[8],
}))
