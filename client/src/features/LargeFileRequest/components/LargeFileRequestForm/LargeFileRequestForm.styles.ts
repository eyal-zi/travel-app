import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

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
