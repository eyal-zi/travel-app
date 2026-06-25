// Shared request-workflow status, used by both trip requests and file requests.

export const REQUEST_STATUSES = ['received', 'processing', 'done'] as const
export type RequestStatus = (typeof REQUEST_STATUSES)[number]

// Display label + MUI palette colour for each workflow status. Shared by the
// request cards, lists, and response dialogs.
export const REQUEST_STATUS_META: Record<
  RequestStatus,
  { label: string; color: 'info' | 'warning' | 'success' }
> = {
  received: { label: 'Received', color: 'info' },
  processing: { label: 'Processing', color: 'warning' },
  done: { label: 'Done', color: 'success' },
}
