import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageRoot = styled(Box)(({ theme }) => ({
  // Locked to the viewport height so the list can size itself against the
  // remaining space rather than overflowing the page.
  height: '100svh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4, 2),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 1.5),
  },
}))

// Centered column holding the header and the admin content, filling the page
// height so the content below can grow into the remaining space. `maxWidth`
// defaults to the standard admin width but callers can widen it.
export const Shell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'maxWidth',
})<{ maxWidth?: number }>(({ theme, maxWidth = 1040 }) => ({
  width: '100%',
  maxWidth,
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))

export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}))

export const HeaderText = styled(Box)({
  minWidth: 0,
})
