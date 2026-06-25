import { styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'

const panelBase = (theme: Theme) => ({
  width: '100%',
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
})

// The request form: a scrollable card holding the fields, the map and the
// submit action. Flexes to fill the tab's remaining height.
export const FormCard = styled('form')(({ theme }) => ({
  ...panelBase(theme),
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  overflowY: 'auto',
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
    padding: theme.spacing(2.5),
  },
}))

// Two controls side by side, stacking on small screens.
export const FieldRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  '& > *': { flex: 1, minWidth: 0 },
}))

// A labelled block (label/hint above the control).
export const Field = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

// Frames the embedded request-area map with rounded, clipped corners.
export const MapFrame = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 280,
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}))

export const Actions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
  marginTop: 'auto',
  paddingTop: theme.spacing(0.5),
}))
