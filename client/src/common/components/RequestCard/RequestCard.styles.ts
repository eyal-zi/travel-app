import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export const Card = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  padding: theme.spacing(2),
  borderRadius: 14,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  cursor: 'pointer',
  transition: theme.transitions.create(['border-color', 'box-shadow']),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[1],
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}))

export const CardTop = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
}))

// Two-column grid of labelled detail fields; collapses to one column on mobile.
export const DetailGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing(1.25),
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}))

export const Detail = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
})

// Row of small chips for tag lists (file types, geo tags).
export const ChipRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.25),
}))

export const Footer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  paddingTop: theme.spacing(0.5),
  borderTop: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.secondary,
  '& svg': { fontSize: 16 },
}))

// Small chips flagging that the admin has left a note and/or files.
export const Indicators = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
}))

// Trip goal heading at the top of the card.
export const GoalTitle = styled(Typography)({
  fontWeight: 700,
  wordBreak: 'break-word',
})

// Value text inside a labelled detail field.
export const FieldValue = styled(Typography)({
  wordBreak: 'break-word',
})

// Free-text notes block, preserving the requester's line breaks.
export const NotesText = styled(Typography)({
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
})

// "Requested <date>" row: clock icon + caption.
export const RequestedRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
}))

// Stacks the "Requested" and "By <requester>" rows on the left of the footer.
export const FooterMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
}))
