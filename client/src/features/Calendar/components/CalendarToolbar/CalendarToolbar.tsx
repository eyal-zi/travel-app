import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
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
import type { CalendarView } from '../../Calendar.types'
import type { CalendarToolbarProps } from './CalendarToolbar.types'
import { useSelectedDate } from '../../../../common/hooks/useSelectedDate'

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
  // Consumed directly (not prop-drilled) to show the picked date stays in sync
  // with clicks in the sibling Calendar grid.
  const [selectedDate] = useSelectedDate()

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

      {selectedDate && (
        // Stored as `yyyy-MM-dd`; show it as `dd-MM-yyyy` for display. Reordering
        // the parts directly avoids the UTC-parsing day shift of `new Date(...)`.
        <Chip
          color="primary"
          size="small"
          label={selectedDate.split('-').reverse().join('-')}
        />
      )}

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
