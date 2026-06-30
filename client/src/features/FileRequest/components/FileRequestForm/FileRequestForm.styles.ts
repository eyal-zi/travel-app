import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Two-column body: the text fields on the left, the request-area map on the
// right. Stacks into a single column on narrow screens.
export const FormBody = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}))

// Left column: the form fields, stacked with a compact, even rhythm.
export const FormMain = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
}))

// Right column: the request-area label, hint and map, filling the height. Takes
// the larger share of the row so the map has plenty of room to work in.
export const FormSide = styled(Box)(({ theme }) => ({
  flex: '0 0 60%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    flex: 'initial',
  },
}))

// Frames the embedded request-area map with rounded, clipped corners. Grows to
// fill the side column; keeps a generous minimum when the layout stacks.
export const MapFrame = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  // Scale the map's height floor with the viewport so it shrinks on short
  // laptop screens (instead of forcing the card past the viewport) while still
  // flexing to fill spare height on tall monitors.
  minHeight: 'clamp(260px, 38svh, 500px)',
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    minHeight: 'clamp(260px, 48svh, 420px)',
  },
}))
