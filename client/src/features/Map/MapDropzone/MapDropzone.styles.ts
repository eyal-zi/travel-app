import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import Popover from '@mui/material/Popover'

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

export const LayerControl = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  zIndex: 1000,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
}))

export const LayerListContainer = styled(Box)({
  minWidth: 200,
  maxWidth: 320,
  maxHeight: 280,
  overflowY: 'auto',
})

export const ActionBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2.5),
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  maxWidth: `calc(100% - ${theme.spacing(4)})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75),
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[8],
}))

export const LayerPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    marginTop: theme.spacing(1),
    borderRadius: (theme.shape.borderRadius as number) * 2,
  },
}))

export const LayerListItemIcon = styled(ListItemIcon)({
  minWidth: 32,
})

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}))

