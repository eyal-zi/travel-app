import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const PageRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100svh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}))

export const PageHeader = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}))

export const PageContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: theme.spacing(3),
  padding: theme.spacing(0, 3, 3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(0, 1.5, 1.5),
  },
}))

export const Sidebar = styled(Box)(({ theme }) => ({
  flex: '0 0 460px',
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  [theme.breakpoints.down('lg')]: {
    flex: '0 0 400px',
  },
  [theme.breakpoints.down('md')]: {
    flex: 'none',
    gap: theme.spacing(1.5),
  },
}))

export const Panel = styled(Box)(({ theme }) => ({
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
}))

export const CalendarContainer = styled(Panel)(({ theme }) => ({
  flex: 3,
  [theme.breakpoints.down('md')]: {
    minHeight: '60svh',
  },
}))

export const MapContainer = styled(Panel)(({ theme }) => ({
  flex: 2,
  [theme.breakpoints.down('md')]: {
    minHeight: '40svh',
  },
}))

export const PdfContainer = styled(Panel)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    minHeight: '70svh',
  },
}))
