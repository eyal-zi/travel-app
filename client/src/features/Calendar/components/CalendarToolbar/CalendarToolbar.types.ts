import type { CalendarView } from '../../Calendar.types'

export interface CalendarToolbarProps {
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  // Navigate the calendar to a specific date chosen from the date picker.
  onGoToDate: (date: Date) => void
  onAddEvent: () => void
  // Whether to show the "Add event" button (admins only).
  canAdd: boolean
}
