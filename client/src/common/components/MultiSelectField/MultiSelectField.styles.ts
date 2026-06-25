import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Wraps the selected chips inside the Select's collapsed value.
export const ChipRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.5),
}))

// Holds the free-text "Other" input inside the Select menu.
export const OtherFieldWrap = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}))
