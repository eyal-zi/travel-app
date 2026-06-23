import type { TripRequestStatus } from '../../types'

// Display label + MUI palette colour for each workflow status. Shared by the
// request card, its list, and the response dialog.
export const STATUS_META: Record<
  TripRequestStatus,
  { label: string; color: 'info' | 'warning' | 'success' }
> = {
  received: { label: 'Received', color: 'info' },
  processing: { label: 'Processing', color: 'warning' },
  done: { label: 'Done', color: 'success' },
}
