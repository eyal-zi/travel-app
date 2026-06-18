import type { EventDialogMode, EventFormValues } from './components/EventDialog/EventDialog.types'

export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay: boolean
  color?: EventColor
}

export type EventColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

/** An event record as returned by the server. Mirrors the `events` table. */
export interface EventRecord extends CalendarEvent {
  createdAt: string
  updatedAt: string
}

/** The writable fields of an event, sent as a JSON body on create/update. */
export type EventInput = Omit<CalendarEvent, 'id'>

export interface CalendarProps {
  initialView?: CalendarView
}

export interface CalendarDialogState {
  open: boolean
  mode: EventDialogMode
  editingId: string | null
  values: EventFormValues
}
