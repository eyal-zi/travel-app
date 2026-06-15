import type { CalendarView } from '../../Calendar.types'

export interface CalendarToolbarProps {
  /** Human-readable period label for the active range, e.g. "June 2026". */
  title: string
  /** Currently active view, controlling the toggle group selection. */
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  /** Open the create dialog with a sensible default range. */
  onAddEvent: () => void
}
