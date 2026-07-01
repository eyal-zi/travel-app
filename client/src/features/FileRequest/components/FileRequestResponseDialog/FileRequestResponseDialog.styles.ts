import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Two-column grid for the large-file metadata fields, collapsing to one column on
// narrow dialogs.
export const FormGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing(1.5, 2),
  alignItems: 'start',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}))

// A labelled field (label above the control).
export const Field = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

// A field spanning the full grid width (e.g. name).
export const FieldWide = styled(Field)({
  gridColumn: '1 / -1',
})

// A field's label row with a trailing hint (e.g. the accuracy value).
export const FieldHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
})

// Frames the embedded footprint map with rounded, clipped corners.
export const MapFrame = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 260,
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}))
