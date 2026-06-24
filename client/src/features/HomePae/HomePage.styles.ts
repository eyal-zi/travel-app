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
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 1.5),
  },
}))

export const HeaderControls = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}))

export const Brand = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  minWidth: 0,
}))

export const BrandMark = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 12,
  color: theme.palette.primary.contrastText,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  boxShadow: theme.shadows[2],
  '& svg': { fontSize: 20 },
}))

export const PageContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: theme.spacing(1),
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
  gap: theme.spacing(1),
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
  flex: 3,
  [theme.breakpoints.down('md')]: {
    minHeight: '40svh',
  },
}))

export const RightColumn = styled(Box)(({ theme }) => ({
  flex: 0.4,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    flex: 'none',
    gap: theme.spacing(1.5),
  },
}))

export const AnnouncementsContainer = styled(Panel)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    minHeight: '70svh',
  },
}))

export const TripRequestCard = styled(Panel)(({ theme }) => ({
  flexShrink: 0,
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  padding: theme.spacing(2),
  color: theme.palette.primary.contrastText,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  border: 'none',
  transition: theme.transitions.create(['transform', 'box-shadow']),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  '& svg': { fontSize: 28 },
}))

export const LargeFileRequestCard = styled(Panel)(({ theme }) => ({
  flexShrink: 0,
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  cursor: 'pointer',
  padding: theme.spacing(2),
  color: theme.palette.secondary.contrastText,
  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
  border: 'none',
  transition: theme.transitions.create(['transform', 'box-shadow']),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  '& svg': { fontSize: 28 },
}))

export const PdfContainer = styled(Panel)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    minHeight: '70svh',
  },
}))
