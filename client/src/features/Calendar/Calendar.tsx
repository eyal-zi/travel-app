import { useEffect, useMemo, useRef, useState } from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { useTheme } from '@mui/material/styles'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import heLocale from '@fullcalendar/core/locales/he'
import type { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import { differenceInCalendarDays, format } from 'date-fns'
import { useSelectedDate } from '../../common/hooks/useSelectedDate'
import { CalendarRoot, StyledCalendarWrapper } from './Calendar.styles'
import { EventDialog } from './components/EventDialog/EventDialog'
import { CalendarToolbar } from './components/CalendarToolbar/CalendarToolbar'
import { toExclusiveEnd, toInclusiveEnd, toLocalInput } from './Calendar.utils'
import { useCalendarEvents } from './useCalendarEvents'
import type { CalendarProps, CalendarView } from './Calendar.types'

const DATE_FMT = 'yyyy-MM-dd'

export const Calendar = ({ initialView = 'dayGridMonth' }: CalendarProps) => {
  const theme = useTheme()
  const calendarRef = useRef<FullCalendar>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [selectedDate, setSelectedDate] = useSelectedDate()

  const {
    events,
    dialog,
    error,
    setError,
    openCreate,
    openEdit,
    closeDialog,
    saveEvent,
    deleteEvent,
    moveEvent,
  } = useCalendarEvents()

  const [view, setView] = useState<CalendarView>(initialView)
  const [title, setTitle] = useState('')

  const getApi = () => calendarRef.current?.getApi()

  // Default the URL-driven selection to today on first mount.
  useEffect(() => {
    if (!selectedDate) setSelectedDate(format(new Date(), DATE_FMT))
  }, [selectedDate, setSelectedDate])

  // Keep FullCalendar sized to its (flex) container, coalescing bursts into one frame.
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let frame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => calendarRef.current?.getApi().updateSize())
    })
    observer.observe(wrapper)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  const fcEvents = useMemo<EventInput[]>(
    () =>
      events.map((event) => {
        const palette = theme.palette[event.color ?? 'primary']
        return {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.allDay && event.end ? toExclusiveEnd(event.end) : event.end,
          allDay: event.allDay,
          backgroundColor: palette.main,
          borderColor: palette.main,
          textColor: palette.contrastText,
        }
      }),
    [events, theme],
  )

  const handleSelect = (selectInfo: DateSelectArg) => {
    getApi()?.unselect()
    // Ignore a bare single-day click in month view; that's handled by dateClick.
    if (selectInfo.allDay && differenceInCalendarDays(selectInfo.end, selectInfo.start) <= 1) return
    openCreate({
      title: '',
      start: toLocalInput(selectInfo.start),
      end: toLocalInput(selectInfo.allDay ? toInclusiveEnd(selectInfo.end) : selectInfo.end),
      allDay: selectInfo.allDay,
      color: 'primary',
    })
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find((candidate) => candidate.id === clickInfo.event.id)
    if (event) openEdit(event)
  }

  const changeView = (next: CalendarView) => {
    getApi()?.changeView(next)
    setView(next)
  }

  return (
    <CalendarRoot elevation={0}>
      <CalendarToolbar
        title={title}
        view={view}
        onViewChange={changeView}
        onPrev={() => getApi()?.prev()}
        onNext={() => getApi()?.next()}
        onToday={() => getApi()?.today()}
        onAddEvent={() => openCreate()}
      />

      <StyledCalendarWrapper ref={wrapperRef}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={initialView}
          locale={heLocale}
          headerToolbar={false}
          height="100%"
          events={fcEvents}
          selectable
          selectMirror
          editable
          dayMaxEvents={false}
          eventDisplay="block"
          nowIndicator
          select={handleSelect}
          dateClick={(arg: DateClickArg) => setSelectedDate(arg.dateStr.slice(0, 10))}
          dayCellClassNames={(arg) =>
            selectedDate && format(arg.date, DATE_FMT) === selectedDate ? ['selected-day'] : []
          }
          eventClick={handleEventClick}
          eventDrop={moveEvent}
          eventResize={moveEvent}
          datesSet={(arg) => {
            setTitle(arg.view.title)
            setView(arg.view.type as CalendarView)
          }}
        />
      </StyledCalendarWrapper>

      <EventDialog
        open={dialog.open}
        mode={dialog.mode}
        initialValues={dialog.values}
        onSave={saveEvent}
        onClose={closeDialog}
        onDelete={dialog.mode === 'edit' ? deleteEvent : undefined}
      />

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </CalendarRoot>
  )
}
