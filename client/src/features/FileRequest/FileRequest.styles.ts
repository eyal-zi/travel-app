import { styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
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

export const Shell = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1040,
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

// Wraps the status-filter bar and the scrollable list so the list still grows
// into the remaining height beneath the (auto-height) filter row.
export const ListSection = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}))

// Horizontal row of status filter chips above the list.
export const FilterBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}))

const panelBase = (theme: Theme) => ({
  width: '100%',
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
})

// List panel: a bounded, scrollable column of request cards.
export const ListPanel = styled(Box)(({ theme }) => ({
  ...panelBase(theme),
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2.5),
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.text.disabled} transparent`,
  '&::-webkit-scrollbar': { width: 8 },
  '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.text.disabled,
    borderRadius: 8,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.text.secondary,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}))

// Centered status/empty/loading row. Column layout so a message and a retry
// button stack without needing inline overrides.
export const StatusRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
}))

// Zero-height sentinel observed for infinite scroll.
export const Sentinel = styled(Box)({
  height: 1,
  flexShrink: 0,
})
