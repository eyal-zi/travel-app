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

export interface CalendarProps {
  initialEvents?: CalendarEvent[]
  initialView?: CalendarView
}

export interface CalendarDialogState {
  open: boolean
  mode: EventDialogMode
  editingId: string | null
  values: EventFormValues
}
