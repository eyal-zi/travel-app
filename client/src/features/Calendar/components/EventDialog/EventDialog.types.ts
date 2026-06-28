import type { EventStyle } from '../../Calendar.types'

export type EventDialogMode = 'create' | 'edit'

export interface EventFormValues {
  title: string
  start: string
  end: string
  allDay: boolean
  style: EventStyle
}

export interface EventDialogProps {
  open: boolean
  mode: EventDialogMode
  initialValues: EventFormValues
  onSave: (values: EventFormValues) => void
  onClose: () => void
  onDelete?: () => void
}
