import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Centered status/empty/loading row. Column layout so a message and a retry
// button stack without needing inline overrides.
export const StatusRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(3),
  color: theme.palette.text.secondary,
}))
