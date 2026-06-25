import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageRoot = styled(Box)(({ theme }) => ({
  // Locked to the viewport height so the active panel can size itself as a
  // share of the remaining space rather than overflowing the page.
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

// Centered column that holds the header, the tab switcher and the active panel.
// Fills the page height so the panel below can grow into the remaining space.
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

// Pill-shaped segmented switcher between the form and the list.
export const TabsBar = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignSelf: 'flex-start',
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  borderRadius: 999,
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.divider}`,
}))

export const TabButton = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  border: 'none',
  cursor: 'pointer',
  padding: theme.spacing(0.75, 2),
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 600,
  fontFamily: 'inherit',
  transition: theme.transitions.create(['background-color', 'color', 'box-shadow']),
  color: active ? theme.palette.text.primary : theme.palette.text.secondary,
  backgroundColor: active ? theme.palette.background.paper : 'transparent',
  boxShadow: active ? theme.shadows[1] : 'none',
  '& svg': { fontSize: 18 },
  '&:hover': {
    color: theme.palette.text.primary,
  },
}))

// Shared card container for both the form and the list panels.
const panelBase = (theme: import('@mui/material/styles').Theme) => ({
  width: '100%',
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
})

export const FormCard = styled('form')(({ theme }) => ({
  ...panelBase(theme),
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
  },
}))

// Grows to fill the card and spreads the field rows evenly across the available
// height, so the form scales with the screen instead of overflowing.
export const FormStack = styled(Box)({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
})

export const FieldRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  '& > *': { flex: 1, minWidth: 0 },
}))

export const Actions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(1),
}))
