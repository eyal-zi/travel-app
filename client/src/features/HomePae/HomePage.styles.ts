import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

/** Full-viewport page shell that fills the viewport and hosts the page header. */
export const PageRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: '100svh',
  backgroundColor: theme.palette.background.default,
}))

/** Top row holding page-level actions such as the color mode toggle. */
export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}))

/**
 * Bounded shell that gives the calendar a flexible height to fill,
 * so it scales from small to large without a fixed pixel size.
 */
export const CalendarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '80vh',
  width: '60%',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}))
