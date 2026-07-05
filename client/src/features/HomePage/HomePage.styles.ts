import { alpha, styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// Slightly larger than the theme default so panels read as soft, modern cards.
const PANEL_RADIUS = 16

export const PageRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100svh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
  // A single brand-tinted glow anchored top-left adds depth without visual
  // noise — the only decorative flourish on an otherwise flat surface.
  backgroundImage:
    theme.palette.mode === 'light'
      ? `radial-gradient(1200px 520px at 0% -10%, ${alpha(theme.palette.primary.light, 0.14)}, transparent 60%)`
      : `radial-gradient(1200px 520px at 0% -10%, ${alpha(theme.palette.primary.dark, 0.22)}, transparent 62%)`,
}))

export const PageHeader = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5, 2),
  },
}))

export const HeaderControls = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

export const Brand = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.75),
  minWidth: 0,
}))

export const BrandMark = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: 14,
  color: theme.palette.primary.contrastText,
  background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
  boxShadow: `0 10px 24px -10px ${alpha(theme.palette.primary.main, 0.6)}`,
  '& svg': { fontSize: 24 },
}))

// Circular initials badge for the signed-in user.
export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 38,
  height: 38,
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: theme.palette.primary.contrastText,
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  border: `2px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[2],
}))

export const PageContent = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: theme.spacing(1.5),
  padding: theme.spacing(0, 3, 3),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    padding: theme.spacing(0, 2, 2),
  },
}))

export const Sidebar = styled(Box)(({ theme }) => ({
  flex: '0 0 460px',
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('lg')]: {
    flex: '0 0 400px',
  },
  [theme.breakpoints.down('md')]: {
    flex: 'none',
  },
}))

// Base card surface: a bordered, softly shadowed column that clips its content.
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

// Consistent card heading (icon + title) that gives the map and document
// panels the same labelled chrome the calendar and announcements already have.
export const PanelHeader = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  '& > svg': { color: theme.palette.primary.main, fontSize: 20 },
}))

// The scrollable/fillable region below a PanelHeader. `position: relative` keeps
// it the positioning context for children that overlay controls on their content.
export const PanelBody = styled(Box)({
  position: 'relative',
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
})

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

export const PdfContainer = styled(Panel)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    minHeight: '70svh',
  },
}))

export const RightColumn = styled(Box)(({ theme }) => ({
  flex: 0.4,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {
    flex: 'none',
  },
}))

export const AnnouncementsContainer = styled(Panel)(({ theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    minHeight: '70svh',
  },
}))

export const QuickActions = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
}))

// Tappable gradient navigation card (trip request / large file request). `tone`
// selects which palette the gradient and text colour are drawn from. Built on
// ButtonBase for real button semantics (focus ring, keyboard, ripple).
export const ActionCard = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: 'primary' | 'secondary' }>(({ theme, tone }) => ({
  width: '100%',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  textAlign: 'left',
  padding: theme.spacing(1.75, 2),
  borderRadius: PANEL_RADIUS,
  color: theme.palette[tone].contrastText,
  background: `linear-gradient(135deg, ${theme.palette[tone].main}, ${theme.palette[tone].dark})`,
  boxShadow: `0 12px 26px -16px ${alpha(theme.palette[tone].main, 0.9)}`,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 18px 32px -16px ${alpha(theme.palette[tone].main, 0.95)}`,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette[tone].main}`,
    outlineOffset: 2,
  },
}))

// Translucent square housing an action card's icon.
export const ActionIcon = styled(Box)({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 12,
  backgroundColor: alpha('#ffffff', 0.18),
  '& svg': { fontSize: 22 },
})

// Trailing chevron that hints the card navigates elsewhere.
export const ActionChevron = styled(Box)({
  marginLeft: 'auto',
  display: 'flex',
  opacity: 0.75,
})

// Personalised greeting line in the header (bolder than the h5 default).
export const Greeting = styled(Typography)({
  fontWeight: 700,
})

// Title line inside an action card (bolder than the subtitle1 default).
export const ActionTitle = styled(Typography)({
  fontWeight: 600,
})

// Tight, truncatable text column (min-width:0 lets noWrap children ellipsize).
export const TextColumn = styled(Stack)({
  minWidth: 0,
})

// Muted subtitle line inside a gradient action card.
export const CardSubtitle = styled(Typography)({
  opacity: 0.85,
})
