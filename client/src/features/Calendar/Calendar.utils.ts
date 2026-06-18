import { addHours, format, parseISO } from 'date-fns'
import type { CalendarEvent, EventInput } from './Calendar.types'
import type { EventFormValues } from './components/EventDialog/EventDialog.types'

const LOCAL_FMT = "yyyy-MM-dd'T'HH:mm"
const DATE_FMT = 'yyyy-MM-dd'

export const toLocalInput = (date: Date) => format(date, LOCAL_FMT)

export const toStored = (date: Date, allDay: boolean) =>
  format(date, allDay ? DATE_FMT : LOCAL_FMT)

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

/** The writable event fields from the dialog form, ready to POST/PUT. */
export const formToInput = (values: EventFormValues): EventInput => ({
  title: values.title,
  start: values.allDay ? values.start.slice(0, 10) : values.start,
  end: values.allDay ? values.end.slice(0, 10) : values.end,
  allDay: values.allDay,
  color: values.color,
})

export const formToEvent = (values: EventFormValues, id: string): CalendarEvent => ({
  id,
  ...formToInput(values),
})
