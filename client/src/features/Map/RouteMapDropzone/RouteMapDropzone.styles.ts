import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import Popover from '@mui/material/Popover'


export const RouteMapRoot = styled(Box)({
  position: 'relative',
  height: '100%',
  width: '100%',
  minHeight: 0,
})

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

export const LayerPopover = styled(Popover)(({ theme }) => ({
  '& .MuiPopover-paper': {
    marginTop: theme.spacing(1),
    borderRadius: (theme.shape.borderRadius as number) * 2,
  },
}))

export const LayerListItemIcon = styled(ListItemIcon)({
  minWidth: 32,
})
