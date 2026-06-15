import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
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

/**
 * Modern, parent-filling calendar built on FullCalendar with a custom MUI
 * toolbar. Supports creating multi-day events by dragging across days (or via
 * the dialog), plus drag/resize editing. Events live in component state.
 */
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

  // FullCalendar only re-measures on `window` resize, so it ignores changes to
  // its parent's size. Observe the wrapper and call `updateSize()` whenever the
  // container resizes, so the grid scales cleanly inside any parent — not just
  // the viewport. `requestAnimationFrame` coalesces resize bursts.
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

  // Resolve each event's palette key to concrete theme colours for the grid.
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

  // --- FullCalendar callbacks ---

  // A single day click also fires `select` (a 1-day all-day span); treat that
  // as a date pick (handled by `handleDateClick`), not an event creation.
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

  // Clicking a day picks it: persisted in the URL via `useSelectedDate`.
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

  // --- Dialog actions ---

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

  // --- Toolbar actions ---

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
          headerToolbar={false}
          height="100%"
          events={fcEvents}
          selectable
          selectMirror
          editable
          dayMaxEvents
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
