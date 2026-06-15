import type { EventColor } from '../../Calendar.types'

/** Whether the dialog is creating a brand-new event or editing an existing one. */
export type EventDialogMode = 'create' | 'edit'

/** Form state held by {@link EventDialog} while open. */
export interface EventFormValues {
  title: string
  /** `datetime-local` strings, e.g. `2026-06-15T09:00`. */
  start: string
  end: string
  allDay: boolean
  color: EventColor
}

export interface EventDialogProps {
  open: boolean
  mode: EventDialogMode
  /** Initial values to seed the form when the dialog opens. */
  initialValues: EventFormValues
  onSave: (values: EventFormValues) => void
  onClose: () => void
  /** Delete the event being edited. Only shown in `edit` mode. */
  onDelete?: () => void
}

/** Ordered list of selectable event colours, mapped to theme palette keys. */
export const EVENT_COLOR_OPTIONS: EventColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
]
