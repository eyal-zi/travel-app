import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'


const PANEL_RADIUS = 18

export const PageRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}))

export const PageContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: theme.spacing(1.25),
  padding: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
  },
}))

export const Panel = styled(Box)(({ theme }) => ({
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: PANEL_RADIUS,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 28px -16px rgba(15, 23, 42, 0.18)'
      : '0 1px 2px rgba(0, 0, 0, 0.5)',
}))



export const PanelHeader = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  '& > svg': { color: theme.palette.primary.main, fontSize: 20 },
}))



export const PanelBody = styled(Box)({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
})

export const MapContainer = styled(Panel)(({ theme }) => ({
  flex: '1.1 1 0',
  minWidth: 340,
  [theme.breakpoints.down('lg')]: {
    minWidth: 300,
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 0,
    minHeight: '46svh',
  },
}))

export const PdfContainer = styled(Panel)(({ theme }) => ({
  flex: '1.6 1 0',
  minWidth: 380,
  [theme.breakpoints.down('md')]: {
    minWidth: 0,
    minHeight: '70svh',
  },
}))

export const RightColumn = styled(Box)(({ theme }) => ({
  flex: '0.9 1 0',
  minWidth: 280,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  [theme.breakpoints.down('lg')]: {
    minWidth: 260,
  },
  [theme.breakpoints.down('md')]: {
    flex: 'none',
    minWidth: 0,
  },
}))

export const CalendarContainer = styled(Panel)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    minHeight: '50svh',
  },
}))

export const AnnouncementsContainer = styled(Panel)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    minHeight: '50svh',
  },
}))
