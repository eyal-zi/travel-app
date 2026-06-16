import type { EventColor } from '../../Calendar.types'

export type EventDialogMode = 'create' | 'edit'

export interface EventFormValues {
  title: string
  start: string
  end: string
  allDay: boolean
  color: EventColor
}

export interface EventDialogProps {
  open: boolean
  mode: EventDialogMode
  initialValues: EventFormValues
  onSave: (values: EventFormValues) => void
  onClose: () => void
  onDelete?: () => void
}

export const EVENT_COLOR_OPTIONS: EventColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
]
