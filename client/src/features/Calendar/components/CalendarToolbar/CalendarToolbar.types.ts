import type { CalendarView } from '../../Calendar.types'

export interface CalendarToolbarProps {
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  
  onGoToDate: (date: Date) => void
  onAddEvent: () => void
  
  canAdd: boolean
}
