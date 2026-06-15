import { styled, alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

/**
 * Full-height flex column: toolbar on top, calendar grid filling the rest.
 * `minHeight: 0` lets the grid shrink inside a constrained parent so the
 * component scales cleanly from a small panel to a full-screen layout.
 */
export const CalendarRoot = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  minHeight: 0,
  padding: theme.spacing(2, 2.5),
  gap: theme.spacing(1),
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  border: `1px solid ${theme.palette.divider}`,
}))

/**
 * Theming surface for FullCalendar. FullCalendar v6 is styled through its
 * `--fc-*` CSS custom properties, so we map them onto the MUI theme here and
 * round/refine the chrome via `.fc-*` selectors — all inside `styled()`,
 * no global stylesheet or inline overrides.
 */
export const StyledCalendarWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',

  // --- FullCalendar theme variables, driven by the MUI palette ---
  '--fc-border-color': theme.palette.divider,
  '--fc-page-bg-color': theme.palette.background.paper,
  '--fc-neutral-bg-color': alpha(theme.palette.text.primary, 0.04),
  '--fc-today-bg-color': alpha(theme.palette.primary.main, 0.08),
  '--fc-now-indicator-color': theme.palette.error.main,
  '--fc-event-bg-color': theme.palette.primary.main,
  '--fc-event-border-color': theme.palette.primary.main,
  '--fc-event-text-color': theme.palette.primary.contrastText,
  '--fc-list-event-hover-bg-color': alpha(theme.palette.primary.main, 0.08),
  '--fc-highlight-color': alpha(theme.palette.primary.main, 0.12),

  // The grid itself fills the wrapper.
  '& .fc': {
    flex: 1,
    minHeight: 0,
    fontFamily: theme.typography.fontFamily,
  },

  // Column headers and day numbers: lighter, modern typography.
  '& .fc .fc-col-header-cell-cushion': {
    paddingBlock: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.caption.fontSize,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: theme.palette.text.secondary,
  },
  '& .fc .fc-daygrid-day-number': {
    padding: theme.spacing(0.75),
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.text.secondary,
  },
  '& .fc .fc-day-today .fc-daygrid-day-number': {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold,
  },

  // Rounded, padded event bars (works for single- and multi-day spans).
  '& .fc .fc-daygrid-event, & .fc .fc-timegrid-event': {
    borderRadius: (theme.shape.borderRadius as number) / 1.5,
    paddingInline: theme.spacing(0.75),
    fontWeight: theme.typography.fontWeightMedium,
    boxShadow: 'none',
  },
  '& .fc .fc-event': {
    cursor: 'pointer',
    border: 'none',
  },

  // Outer frame: drop FullCalendar's default outer border, we use the Paper's.
  '& .fc .fc-scrollgrid': {
    border: 'none',
  },
  '& .fc .fc-scrollgrid-section > *': {
    borderBottom: 'none',
  },

  // Time-axis and slot labels.
  '& .fc .fc-timegrid-slot-label-cushion, & .fc .fc-timegrid-axis-cushion': {
    fontSize: theme.typography.caption.fontSize,
    color: theme.palette.text.secondary,
  },

  // Range highlight while drag-selecting new (multi-day) events.
  '& .fc .fc-highlight': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },
}))
