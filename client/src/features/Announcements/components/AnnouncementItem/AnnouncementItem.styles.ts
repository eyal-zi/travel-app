import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const Card = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1.5, 1.75),
  borderRadius: 12,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
}))

export const Meta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}))
