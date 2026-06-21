import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import Tooltip from '@mui/material/Tooltip'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import {
  AddButton,
  Controls,
  NavGroup,
  PeriodTitle,
  SelectedChip,
  TitleGroup,
  TodayButton,
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

const VIEW_ORDER = Object.keys(VIEW_LABELS) as CalendarView[]

export const CalendarToolbar = ({
  title,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onAddEvent,
}: CalendarToolbarProps) => {
  const [selectedDate] = useSelectedDate()
  const formattedDate = selectedDate?.split('-').reverse().join('-')

  return (
    <ToolbarRoot>
      <TitleGroup>
        <PeriodTitle variant="h6">{title}</PeriodTitle>
        {formattedDate && <SelectedChip color="primary" size="small" label={formattedDate} />}
      </TitleGroup>

      <Controls>
        <NavGroup>
          <Tooltip title="Previous">
            <IconButton size="small" onClick={onPrev} aria-label="Previous period">
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <TodayButton variant="outlined" color="inherit" size="small" onClick={onToday}>
            Today
          </TodayButton>
          <Tooltip title="Next">
            <IconButton size="small" onClick={onNext} aria-label="Next period">
              <ChevronRightRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </NavGroup>

        <ViewToggle
          exclusive
          size="small"
          value={view}
          onChange={(_, next: CalendarView | null) => next && onViewChange(next)}
          aria-label="Calendar view"
        >
          {VIEW_ORDER.map((value) => (
            <ToggleButton key={value} value={value}>
              {VIEW_LABELS[value]}
            </ToggleButton>
          ))}
        </ViewToggle>

        <Tooltip title="Add event">
          <AddButton size="small" onClick={onAddEvent} aria-label="Add event">
            <AddRoundedIcon fontSize="small" />
          </AddButton>
        </Tooltip>
      </Controls>
    </ToolbarRoot>
  )
}
