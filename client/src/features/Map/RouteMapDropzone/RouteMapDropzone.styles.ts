import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Positioning context so the date title can overlay the map, which fills it.
export const RouteMapRoot = styled(Box)({
  position: 'relative',
  height: '100%',
  width: '100%',
  minHeight: 0,
})

export const UploadedTitle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  left: theme.spacing(1.5),
  zIndex: 1000,
  pointerEvents: 'none',
  padding: theme.spacing(0.5, 1.25),
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  color: theme.palette.text.secondary,
  fontSize: theme.typography.caption.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
}))
