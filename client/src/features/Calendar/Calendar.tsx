import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import heLocale from '@fullcalendar/core/locales/he'
import type { DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core'
import type { DateClickArg, EventResizeDoneArg } from '@fullcalendar/interaction'
import { differenceInCalendarDays, format } from 'date-fns'
import { useSelectedDate } from '../../common/hooks/useSelectedDate'
import { CalendarRoot, StyledCalendarWrapper } from './Calendar.styles'
import { EventDialog } from './components/EventDialog/EventDialog'
import {
  buildDefaultEvents,
  defaultFormValues,
  eventToForm,
  formToEvent,
  toLocalInput,
  toStored,
} from './Calendar.utils'
import type { EventFormValues } from './components/EventDialog/EventDialog.types'
import type { CalendarDialogState, CalendarProps, CalendarView } from './Calendar.types'
import { CalendarToolbar } from './components/CalendarToolbar/CalendarToolbar'

export const Calendar = ({ initialEvents, initialView = 'dayGridMonth' }: CalendarProps) => {
  const theme = useTheme()
  const calendarRef = useRef<FullCalendar>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [selectedDate, setSelectedDate] = useSelectedDate()

  const [events, setEvents] = useState(() => initialEvents ?? buildDefaultEvents())
  const [view, setView] = useState<CalendarView>(initialView)
  const [title, setTitle] = useState('')
  const [dialog, setDialog] = useState<CalendarDialogState>({
    open: false,
    mode: 'create',
    editingId: null,
    values: defaultFormValues(),
  })

  const api = () => calendarRef.current?.getApi()

  useEffect(() => {
    if (!selectedDate) setSelectedDate(format(new Date(), 'yyyy-MM-dd'))
  }, [selectedDate, setSelectedDate])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let frame = 0
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => api()?.updateSize())
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
          end: event.end,
          allDay: event.allDay,
          backgroundColor: palette.main,
          borderColor: palette.main,
          textColor: palette.contrastText,
        }
      }),
    [events, theme],
  )

  const closeDialog = () => setDialog((prev) => ({ ...prev, open: false }))

  const openCreate = (values: EventFormValues) =>
    setDialog({ open: true, mode: 'create', editingId: null, values })


  const handleSelect = (selectInfo: DateSelectArg) => {
    api()?.unselect()
    if (selectInfo.allDay && differenceInCalendarDays(selectInfo.end, selectInfo.start) <= 1) return
    openCreate({
      title: '',
      start: toLocalInput(selectInfo.start),
      end: toLocalInput(selectInfo.end),
      allDay: selectInfo.allDay,
      color: 'primary',
    })
  }

  const handleDateClick = (arg: DateClickArg) => setSelectedDate(arg.dateStr.slice(0, 10))

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = events.find((candidate) => candidate.id === clickInfo.event.id)
    if (!event) return
    setDialog({ open: true, mode: 'edit', editingId: event.id, values: eventToForm(event) })
  }

  const applyDrag = (info: EventDropArg | EventResizeDoneArg) => {
    const { id, start, end, allDay } = info.event
    if (!start) return
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? {
            ...event,
            start: toStored(start, allDay),
            end: end ? toStored(end, allDay) : undefined,
            allDay,
          }
          : event,
      ),
    )
  }


  const handleSave = (values: EventFormValues) => {
    if (dialog.mode === 'edit' && dialog.editingId) {
      const id = dialog.editingId
      setEvents((prev) => prev.map((event) => (event.id === id ? formToEvent(values, id) : event)))
    } else {
      setEvents((prev) => [...prev, formToEvent(values, crypto.randomUUID())])
    }
    closeDialog()
  }

  const handleDelete = () => {
    if (!dialog.editingId) return
    const id = dialog.editingId
    setEvents((prev) => prev.filter((event) => event.id !== id))
    closeDialog()
  }


  const changeView = (next: CalendarView) => {
    api()?.changeView(next)
    setView(next)
  }

  return (
    <CalendarRoot elevation={0}>
      <CalendarToolbar
        title={title}
        view={view}
        onViewChange={changeView}
        onPrev={() => api()?.prev()}
        onNext={() => api()?.next()}
        onToday={() => api()?.today()}
        onAddEvent={() => openCreate(defaultFormValues())}
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
          dateClick={handleDateClick}
          dayCellClassNames={(arg) =>
            selectedDate && format(arg.date, 'yyyy-MM-dd') === selectedDate ? ['selected-day'] : []
          }
          eventClick={handleEventClick}
          eventDrop={applyDrag}
          eventResize={applyDrag}
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
        onSave={handleSave}
        onClose={closeDialog}
        onDelete={dialog.mode === 'edit' ? handleDelete : undefined}
      />
    </CalendarRoot>
  )
}
