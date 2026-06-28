import type { ReactNode } from 'react'
import type { RequestStatus } from '../../requests/requestStatus'

// The active filter on a request feed: a single workflow status.
export type StatusFilter = RequestStatus

export type RequestFeedProps<T> = {
  // Cursor-paginated feed result (the shape returned by the use*Requests hooks).
  items: T[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  // Status filter, owned by the caller so it can feed its query hook.
  statusFilter: StatusFilter
  onStatusFilterChange: (status: StatusFilter) => void
  // Renders a single request card; `getItemKey` supplies its React key.
  renderItem: (item: T) => ReactNode
  getItemKey: (item: T) => string
  // Plural noun used in empty/error messages, e.g. "file requests".
  noun: string
}
