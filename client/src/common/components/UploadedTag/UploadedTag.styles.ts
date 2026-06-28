import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Pill overlaying the top-left corner of its positioned parent (which must
// establish a positioning context). `zIndex` is consumed here rather than
// forwarded to the DOM.
export const TagPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'zIndex',
})<{ zIndex: number }>(({ theme, zIndex }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  left: theme.spacing(1.5),
  zIndex,
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
