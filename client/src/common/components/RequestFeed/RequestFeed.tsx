import { Fragment } from 'react'
import Chip from '@mui/material/Chip'
import { FeedStatus } from '../FeedStatus/FeedStatus'
import { useInfiniteScrollSentinel } from '../../hooks/useInfiniteScrollSentinel'
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_META,
} from '../../requests/requestStatus'
import { FilterBar, ListPanel, ListSection, Sentinel } from './RequestFeed.styles'
import type { RequestFeedProps } from './RequestFeed.types'

/**
 * Newest-first, cursor-paginated request feed with infinite scroll and a status
 * filter. Presentational and feature-agnostic: the caller owns the query (and
 * the status state that drives it) and supplies `renderItem`. Shared by the trip
 * and file request lists.
 */
export const RequestFeed = <T,>({
  items,
  isLoading,
  isError,
  refetch,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  statusFilter,
  onStatusFilterChange,
  renderItem,
  getItemKey,
  noun,
}: RequestFeedProps<T>) => {
  const { sentinelRef } = useInfiniteScrollSentinel({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <ListSection>
      <FilterBar>
        {REQUEST_STATUSES.map((value) => (
          <Chip
            key={value}
            label={REQUEST_STATUS_META[value].label}
            color={statusFilter === value ? REQUEST_STATUS_META[value].color : 'default'}
            variant={statusFilter === value ? 'filled' : 'outlined'}
            onClick={() => onStatusFilterChange(value)}
          />
        ))}
      </FilterBar>

      <ListPanel>
        {items.map((item) => (
          <Fragment key={getItemKey(item)}>{renderItem(item)}</Fragment>
        ))}

        <FeedStatus
          isLoading={isLoading}
          isError={isError}
          isEmpty={items.length === 0}
          isFetchingNextPage={isFetchingNextPage}
          onRetry={refetch}
          errorMessage={`Failed to load ${noun}.`}
          emptyMessage={`No ${REQUEST_STATUS_META[statusFilter].label.toLowerCase()} ${noun}.`}
        />

        {hasNextPage && <Sentinel ref={sentinelRef} />}
      </ListPanel>
    </ListSection>
  )
}
