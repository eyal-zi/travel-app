import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

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
