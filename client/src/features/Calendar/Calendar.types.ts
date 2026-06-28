import type { EventDialogMode, EventFormValues } from './components/EventDialog/EventDialog.types'

export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay: boolean
  style?: EventStyle
}

export type EventColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

/**
 * Markings rendered as a neutral event distinguished by an icon (rather than a
 * palette colour). Add a key here and a matching entry in the `EVENT_ICON_MARKINGS`
 * registry to support another icon — nothing else needs to change on the client.
 */
export type EventIconMarking = 'moon'

/** The marking applied to an event: one of the palette colours, or an icon marking. */
export type EventStyle = EventColor | EventIconMarking

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
