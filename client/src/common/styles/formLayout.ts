import { styled } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Shared styled primitives for the request forms (FileRequest, TripRequest) so
// both stay visually consistent. Factored from the original per-feature styles
// plus the section patterns in RequestResponseDialog.styles.ts.

const panelBase = (theme: Theme) => ({
  width: '100%',
  borderRadius: 16,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
})

// The card holding the form fields and the submit action. Flexes to fill the
// remaining height and lays its sections out with a compact, even rhythm so the
// form fits the viewport without scrolling. Keeps overflow:auto purely as a
// safety net for very short screens.
export const FormCard = styled('form')(({ theme }) => ({
  ...panelBase(theme),
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2.5),
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

// A labelled group of related fields. Separation comes from the card's gap and
// the overline label rather than dividers, keeping the form compact and clean.
export const FormSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

// Side-by-side columns of sections that stack on smaller screens. Lets a form
// spread across the width instead of running tall (and off-screen).
export const FormColumns = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  alignItems: 'flex-start',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  '& > *': { flex: 1, minWidth: 0 },
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

// A labelled block: label/hint above a single control.
export const FieldGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

// Overline heading introducing a section.
export const SectionLabel = styled(Typography)(({ theme }) => ({
  letterSpacing: 0.6,
  fontWeight: 700,
  color: theme.palette.text.secondary,
}))

// One-line secondary description shown under a section label.
export const SectionHint = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(-0.5),
}))

// Submit/cancel row, pinned to the bottom of the card.
export const Actions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(1.5),
  marginTop: 'auto',
  paddingTop: theme.spacing(0.5),
}))
