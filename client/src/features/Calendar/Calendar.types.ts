import type { EventDialogMode, EventFormValues } from './components/EventDialog/EventDialog.types'

/** The three views exposed by the calendar's custom toolbar. */
export type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'

/**
 * A calendar event in app state. Kept structurally compatible with
 * FullCalendar's {@link EventInput} so it can be passed straight to the grid.
 * `start`/`end` are ISO strings; `end` is exclusive (FullCalendar convention).
 */
export interface CalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  allDay: boolean
  /** Theme palette key driving the event colour (resolved in `Calendar`). */
  color?: EventColor
}

/** Selectable event colours, mapped to concrete hues in `EventDialog`. */
export type EventColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

export interface CalendarProps {
  /** Events to seed the calendar with on first render. */
  initialEvents?: CalendarEvent[]
  /** View shown on first render. Defaults to `dayGridMonth`. */
  initialView?: CalendarView
}

/** Open/closed state of the create/edit dialog, owned by `Calendar`. */
export interface CalendarDialogState {
  open: boolean
  mode: EventDialogMode
  /** Id of the event being edited, or `null` in create mode. */
  editingId: string | null
  values: EventFormValues
}
