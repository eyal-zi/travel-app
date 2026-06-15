import { addHours, format, parseISO } from 'date-fns'
import type { CalendarEvent } from './Calendar.types'
import type { EventFormValues } from './components/EventDialog/EventDialog.types'

const LOCAL_FMT = "yyyy-MM-dd'T'HH:mm"
const DATE_FMT = 'yyyy-MM-dd'

/** Format a `Date` into the form's `datetime-local` string. */
export const toLocalInput = (date: Date) => format(date, LOCAL_FMT)

/** Format a FullCalendar `Date` into stored form (date-only when all-day). */
export const toStored = (date: Date, allDay: boolean) =>
  format(date, allDay ? DATE_FMT : LOCAL_FMT)

/** Seed events demonstrating single- and multi-day spans, anchored to today. */
export const buildDefaultEvents = (): CalendarEvent[] => {
  const today = new Date()
  const dayAt = (dayOffset: number, hour: number) =>
    toLocalInput(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayOffset, hour),
    )
  const dayDate = (dayOffset: number) =>
    format(new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayOffset), DATE_FMT)
  return [
    {
      id: crypto.randomUUID(),
      title: 'Kickoff call',
      start: dayAt(0, 10),
      end: dayAt(0, 11),
      allDay: false,
      color: 'primary',
    },
    {
      id: crypto.randomUUID(),
      title: 'Lisbon trip',
      start: dayDate(0),
      end: dayDate(4),
      allDay: true,
      color: 'secondary',
    },
  ]
}

/** Default form values for a fresh "Add event" with a one-hour slot from now. */
export const defaultFormValues = (): EventFormValues => {
  const start = new Date()
  return {
    title: '',
    start: toLocalInput(start),
    end: toLocalInput(addHours(start, 1)),
    allDay: false,
    color: 'primary',
  }
}

/** Convert a stored event into editable form values. */
export const eventToForm = (event: CalendarEvent): EventFormValues => {
  const start = parseISO(event.start)
  const end = event.end ? parseISO(event.end) : addHours(start, 1)
  return {
    title: event.title,
    start: toLocalInput(start),
    end: toLocalInput(end),
    allDay: event.allDay,
    color: event.color ?? 'primary',
  }
}

/** Convert form values back into a stored event with the given id. */
export const formToEvent = (values: EventFormValues, id: string): CalendarEvent => ({
  id,
  title: values.title,
  start: values.allDay ? values.start.slice(0, 10) : values.start,
  end: values.allDay ? values.end.slice(0, 10) : values.end,
  allDay: values.allDay,
  color: values.color,
})
