

export const REQUEST_STATUSES = ['received', 'processing', 'done'] as const
export type RequestStatus = (typeof REQUEST_STATUSES)[number]



export const REQUEST_STATUS_META: Record<
  RequestStatus,
  { label: string; color: 'info' | 'warning' | 'success' }
> = {
  received: { label: 'Received', color: 'info' },
  processing: { label: 'Processing', color: 'warning' },
  done: { label: 'Done', color: 'success' },
}
