import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'



export const FormBody = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  },
}))


export const FormMain = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
}))



export const FormSide = styled(Box)(({ theme }) => ({
  flex: '0 0 60%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    flex: 'initial',
  },
}))



export const MapFrame = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  
  
  
  minHeight: 'clamp(260px, 38svh, 500px)',
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    minHeight: 'clamp(260px, 48svh, 420px)',
  },
}))
