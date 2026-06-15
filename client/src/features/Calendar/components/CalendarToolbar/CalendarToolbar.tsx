import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import Tooltip from '@mui/material/Tooltip'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import {
  ActionGroup,
  NavGroup,
  PeriodTitle,
  ToolbarRoot,
  ViewToggle,
} from './CalendarToolbar.styles'
import type { CalendarView } from './Calendar.types'
import type { CalendarToolbarProps } from './CalendarToolbar.types'

const VIEW_LABELS: Record<CalendarView, string> = {
  dayGridMonth: 'Month',
  timeGridWeek: 'Week',
  timeGridDay: 'Day',
}

/** Custom MUI toolbar driving FullCalendar navigation and the active view. */
export const CalendarToolbar = ({
  title,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onAddEvent,
}: CalendarToolbarProps) => {
  return (
    <ToolbarRoot>
      <NavGroup>
        <Tooltip title="Previous">
          <IconButton onClick={onPrev} aria-label="Previous period">
            <ChevronLeftRoundedIcon />
          </IconButton>
        </Tooltip>
        <Button variant="outlined" color="inherit" onClick={onToday}>
          Today
        </Button>
        <Tooltip title="Next">
          <IconButton onClick={onNext} aria-label="Next period">
            <ChevronRightRoundedIcon />
          </IconButton>
        </Tooltip>
      </NavGroup>

      <PeriodTitle variant="h5">{title}</PeriodTitle>

      <ActionGroup>
        <ViewToggle
          exclusive
          size="small"
          value={view}
          onChange={(_, next: CalendarView | null) => next && onViewChange(next)}
          aria-label="Calendar view"
        >
          {(Object.keys(VIEW_LABELS) as CalendarView[]).map((value) => (
            <ToggleButton key={value} value={value}>
              {VIEW_LABELS[value]}
            </ToggleButton>
          ))}
        </ViewToggle>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={onAddEvent}>
          Add event
        </Button>
      </ActionGroup>
    </ToolbarRoot>
  )
}
