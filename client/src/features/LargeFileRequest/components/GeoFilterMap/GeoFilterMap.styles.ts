import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'

// Floating chip over the map showing how many areas are drawn, with a delete
// affordance to clear them.
export const OverlayChip = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  zIndex: 1000,
}))
