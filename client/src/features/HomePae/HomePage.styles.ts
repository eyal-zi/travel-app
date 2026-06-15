import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

/**
 * Full-viewport page shell that gives the calendar a flexible height to fill,
 * so it scales from small to large without a fixed pixel size.
 */
export const HomePageRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '60vh',
  width: '60%',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.5),
  },
}))
