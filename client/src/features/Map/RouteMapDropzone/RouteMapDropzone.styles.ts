import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Positioning context so the date title can overlay the map, which fills it.
export const RouteMapRoot = styled(Box)({
  position: 'relative',
  height: '100%',
  width: '100%',
  minHeight: 0,
})
