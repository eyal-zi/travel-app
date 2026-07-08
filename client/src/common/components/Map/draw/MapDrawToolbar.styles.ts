import { alpha, styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'





const GLASS = '#cbd5e1'



const ICON = '#1e293b'
const ICON_SELECTED = '#0f766e'

export const ToolbarRoot = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(9),
  left: theme.spacing(1.5),
  zIndex: 1000,
  padding: theme.spacing(0.5),
  borderRadius: (theme.shape.borderRadius as number) * 1.25,
  backgroundColor: alpha(GLASS, 0.88),
  
  border: `1px solid ${alpha('#ffffff', 0.35)}`,
  boxShadow: `${theme.shadows[4]}, inset 0 1px 0 ${alpha('#ffffff', 0.25)}`,
}))

export const ToolbarGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(0.25),
  '& .MuiToggleButtonGroup-grouped': {
    margin: 0,
    padding: theme.spacing(0.75),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    color: ICON,
    '&:hover': {
      color: ICON,
      backgroundColor: alpha('#ffffff', 0.25),
    },
    '&.Mui-selected': {
      color: ICON_SELECTED,
      backgroundColor: alpha('#ffffff', 0.45),
      '&:hover': {
        backgroundColor: alpha('#ffffff', 0.55),
      },
    },
  },
}))
