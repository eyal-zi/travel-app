import type { ReactNode } from 'react'
import type { RequestStatus } from '../../requests/requestStatus'


export type StatusFilter = RequestStatus

export type RequestFeedProps<T> = {
  
  items: T[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  
  statusFilter: StatusFilter
  onStatusFilterChange: (status: StatusFilter) => void
  
  renderItem: (item: T) => ReactNode
  getItemKey: (item: T) => string
  
  noun: string
}
