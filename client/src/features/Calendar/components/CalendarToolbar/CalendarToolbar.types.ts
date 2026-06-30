import type { CalendarView } from '../../Calendar.types'

export interface CalendarToolbarProps {
  title: string
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onAddEvent: () => void
  // Whether to show the "Add event" button (admins only).
  canAdd: boolean
}
