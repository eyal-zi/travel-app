import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import heLocale from '@fullcalendar/core/locales/he'
import type {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  EventInput,
} from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import { differenceInCalendarDays, format } from 'date-fns'
import { useSelectedDate } from '../../common/hooks/useSelectedDate'
import { Notification } from '../../common/components/Notification/Notification'
import { useIsAdmin } from '../Auth/hooks/useIsAdmin'
import { CalendarRoot, EventContent, StyledCalendarWrapper } from './Calendar.styles'
import { getMarkingIcon, resolveEventAppearance } from './eventStyles'
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
  const canEdit = useIsAdmin()

  const {
    events,
    dialog,
    notification,
    closeNotification,
    openCreate,
    openEdit,
    closeDialog,
    saveEvent,
    deleteEvent,
    moveEvent,
  } = useCalendarEvents()

  const [view, setView] = useState<CalendarView>(initialView)

  const getApi = () => calendarRef.current?.getApi()

  
  useEffect(() => {
    if (!selectedDate) setSelectedDate(format(new Date(), DATE_FMT))
  }, [selectedDate, setSelectedDate])

  
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
        const { backgroundColor, borderColor, textColor } = resolveEventAppearance(
          theme,
          event.style,
        )
        return {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.allDay && event.end ? toExclusiveEnd(event.end) : event.end,
          allDay: event.allDay,
          backgroundColor,
          borderColor,
          textColor,
          extendedProps: { style: event.style },
        }
      }),
    [events, theme],
  )

  
  
  const renderEventContent = (arg: EventContentArg) => {
    const MarkingIcon = getMarkingIcon(arg.event.extendedProps.style ?? 'primary')
    return (
      <EventContent>
        {MarkingIcon && <MarkingIcon className="fc-event-marking" fontSize="inherit" />}
        {arg.timeText && <span className="fc-event-time">{arg.timeText}</span>}
        {arg.event.title && <span className="fc-event-title">{arg.event.title}</span>}
      </EventContent>
    )
  }

  const handleSelect = (selectInfo: DateSelectArg) => {
    getApi()?.unselect()
    
    if (selectInfo.allDay && differenceInCalendarDays(selectInfo.end, selectInfo.start) <= 1) return
    openCreate({
      title: '',
      start: toLocalInput(selectInfo.start),
      end: toLocalInput(selectInfo.allDay ? toInclusiveEnd(selectInfo.end) : selectInfo.end),
      allDay: selectInfo.allDay,
      style: 'primary',
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
        view={view}
        onViewChange={changeView}
        onPrev={() => getApi()?.prev()}
        onNext={() => getApi()?.next()}
        onGoToDate={(date) => getApi()?.gotoDate(date)}
        onAddEvent={() => openCreate()}
        canAdd={canEdit}
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
          selectable={canEdit}
          selectMirror
          editable={canEdit}
          dayMaxEvents={false}
          eventDisplay="block"
          eventContent={renderEventContent}
          nowIndicator
          select={handleSelect}
          dateClick={(arg: DateClickArg) => setSelectedDate(arg.dateStr.slice(0, 10))}
          dayCellClassNames={(arg) =>
            selectedDate && format(arg.date, DATE_FMT) === selectedDate ? ['selected-day'] : []
          }
          eventClick={canEdit ? handleEventClick : undefined}
          eventDrop={moveEvent}
          eventResize={moveEvent}
          datesSet={(arg) => {
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

      <Notification notification={notification} onClose={closeNotification} />
    </CalendarRoot>
  )
}
