import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

/**
 * Full-viewport page shell. Pins to the viewport height and hides overflow so
 * the page never scrolls — the content row below absorbs all remaining space.
 */
export const PageRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100svh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}))

/** Top row holding page-level actions such as the color mode toggle. */
export const PageHeader = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}))

/**
 * Content row that fills the space left under the header. Holds the calendar
 * and map side by side, splitting the width and sharing the height. Collapses
 * to a stacked column on small screens — both ways keep everything on screen
 * without scrolling (`minHeight: 0` lets the children shrink to fit).
 */
export const PageContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: theme.spacing(3),
  padding: theme.spacing(0, 3, 3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(0, 1.5, 1.5),
  },
}))

/**
 * Bounded shell for the calendar. Flexes to share the row evenly with the map;
 * `minWidth/minHeight: 0` lets it shrink below its content's natural size so the
 * grid scales cleanly instead of forcing the page to scroll.
 */
export const CalendarContainer = styled(Box)({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
})

/** Bounded shell for the map, mirroring `CalendarContainer` so they sit as a set. */
export const MapContainer = styled(Box)({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
})
