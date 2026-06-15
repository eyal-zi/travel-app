import { useMemo, useRef, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core'
import type { EventResizeDoneArg } from '@fullcalendar/interaction'
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

  const handleSelect = (selectInfo: DateSelectArg) => {
    api()?.unselect()
    openCreate({
      title: '',
      start: toLocalInput(selectInfo.start),
      end: toLocalInput(selectInfo.end),
      allDay: selectInfo.allDay,
      color: 'primary',
    })
  }

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

      <StyledCalendarWrapper>
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
