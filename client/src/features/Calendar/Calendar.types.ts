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






export type EventIconMarking = 'moon'


export type EventStyle = EventColor | EventIconMarking


export interface EventRecord extends CalendarEvent {
  createdAt: string
  updatedAt: string
}


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
