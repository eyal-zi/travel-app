import { styled, alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

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

  containerType: 'inline-size',
  containerName: 'calendar',

  '@container calendar (max-width: 600px)': {
    padding: theme.spacing(1.5),
  },
}))

export const StyledCalendarWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',

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

  '& .fc': {
    flex: 1,
    minHeight: 0,
    fontFamily: theme.typography.fontFamily,
  },

  '& .fc-scroller': {
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.palette.text.disabled} transparent`,
    '&::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.text.disabled,
      borderRadius: 8,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: theme.palette.text.secondary,
    },
  },

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

  '& .fc .fc-scrollgrid': {
    border: 'none',
  },
  '& .fc .fc-scrollgrid-section > *': {
    borderBottom: 'none',
  },

  '& .fc .fc-timegrid-slot-label-cushion, & .fc .fc-timegrid-axis-cushion': {
    fontSize: theme.typography.caption.fontSize,
    color: theme.palette.text.secondary,
  },

  '& .fc .fc-highlight': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
  },

  '& .fc .fc-daygrid-day.selected-day': {
    backgroundColor: alpha(theme.palette.primary.main, 0.18),
    boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
  },

  '@container calendar (max-width: 600px)': {
    '& .fc .fc-col-header-cell-cushion': {
      paddingBlock: theme.spacing(0.5),
      letterSpacing: '0.02em',
    },
    '& .fc .fc-daygrid-day-number': {
      padding: theme.spacing(0.5),
      fontSize: theme.typography.caption.fontSize,
    },
    '& .fc .fc-daygrid-event, & .fc .fc-timegrid-event': {
      paddingInline: theme.spacing(0.5),
      fontSize: theme.typography.caption.fontSize,
    },
    '& .fc .fc-timegrid-slot-label-cushion, & .fc .fc-timegrid-axis-cushion': {
      fontSize: '0.6875rem',
    },
  },

  '@container calendar (max-width: 480px)': {
    '& .fc .fc-col-header-cell-cushion': {
      fontSize: '0.6875rem',
      paddingInline: 0,
    },
    '& .fc .fc-daygrid-day-number': {
      padding: theme.spacing(0.25),
      fontSize: '0.6875rem',
    },
  },
}))
