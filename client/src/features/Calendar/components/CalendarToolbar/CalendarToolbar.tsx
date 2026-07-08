import { useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import ToggleButton from '@mui/material/ToggleButton'
import Tooltip from '@mui/material/Tooltip'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format, parseISO } from 'date-fns'
import {
  AddButton,
  Controls,
  NavGroup,
  SelectedChip,
  TitleGroup,
  TodayButton,
  ToolbarRoot,
  ViewToggle,
} from './CalendarToolbar.styles'
import type { CalendarView } from '../../Calendar.types'
import type { CalendarToolbarProps } from './CalendarToolbar.types'
import { useSelectedDate } from '../../../../common/hooks/useSelectedDate'

const VIEW_LABELS: Partial<Record<CalendarView, string>> = {
  dayGridMonth: 'Month',
  timeGridWeek: 'Week',
}

const VIEW_ORDER = Object.keys(VIEW_LABELS) as CalendarView[]

export const CalendarToolbar = ({
  view,
  onViewChange,
  onPrev,
  onNext,
  onGoToDate,
  onAddEvent,
  canAdd,
}: CalendarToolbarProps) => {
  const [selectedDate, setSelectedDate] = useSelectedDate()
  const formattedDate = selectedDate?.split('-').reverse().join('-')

  const [pickerOpen, setPickerOpen] = useState(false)
  const jumpButtonRef = useRef<HTMLButtonElement>(null)

  
  
  const handleAcceptDate = (date: Date | null) => {
    if (!date || Number.isNaN(date.getTime())) return
    onGoToDate(date)
    setSelectedDate(format(date, 'yyyy-MM-dd'))
    setPickerOpen(false)
  }

  return (
    <ToolbarRoot>
      <TitleGroup>
        {formattedDate && <SelectedChip color="primary" size="small" label={formattedDate} />}
      </TitleGroup>

      <Controls>
        <NavGroup>
          <Tooltip title="Previous">
            <IconButton size="small" onClick={onPrev} aria-label="Previous period">
              <ChevronLeftRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Jump to date">
            <TodayButton
              ref={jumpButtonRef}
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<CalendarMonthRoundedIcon fontSize="small" />}
              onClick={() => setPickerOpen(true)}
            >
              Jump to
            </TodayButton>
          </Tooltip>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              open={pickerOpen}
              onClose={() => setPickerOpen(false)}
              value={selectedDate ? parseISO(selectedDate) : new Date()}
              onAccept={handleAcceptDate}
              slots={{ field: () => null }}
              slotProps={{
                popper: { anchorEl: () => jumpButtonRef.current },
                actionBar: { actions: ['today'] },
              }}
            />
          </LocalizationProvider>
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

        {canAdd && (
          <Tooltip title="Add event">
            <AddButton size="small" onClick={onAddEvent} aria-label="Add event">
              <AddRoundedIcon fontSize="small" />
            </AddButton>
          </Tooltip>
        )}
      </Controls>
    </ToolbarRoot>
  )
}
