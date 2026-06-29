import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'

export const PageRoot = styled(Box)(({ theme }) => ({
  minHeight: '100svh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}))

export const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  maxWidth: 460,
  width: '100%',
}))

export const CardStack = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing(3),
}))

export const IconWrap = styled(Box)(({ theme }) => ({
  color: theme.palette.error.main,
  '& svg': { fontSize: 48 },
}))
