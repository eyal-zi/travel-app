import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Field } from '../../LargeFileRequest.styles'

// Compacts the filters into two columns on desktop so they occupy fewer rows,
// leaving the map far more height to flex into. Collapses to a single column on
// narrow screens where the whole form scrolls anyway.
export const FiltersGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing(1, 2),
  alignItems: 'start',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}))

// A filter field that spans the full grid width (e.g. file types, date range).
export const FieldWide = styled(Field)({
  gridColumn: '1 / -1',
})

// A field's label row with a trailing hint (e.g. the accuracy band).
export const FieldHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
})

// Insets the slider so its thumb and edge labels aren't clipped by the card.
export const SliderWrap = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}))

// Lays the start/end date pickers side by side, stacking on narrow cards.
export const DateRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  '& > *': { flex: 1, minWidth: 0 },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}))
