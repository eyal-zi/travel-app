import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Wraps the selected file-type chips inside the Select's collapsed value.
export const ChipRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
}))

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
