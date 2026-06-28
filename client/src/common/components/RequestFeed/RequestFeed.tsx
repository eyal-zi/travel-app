import { Fragment, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_META,
} from '../../requests/requestStatus'
import {
  FilterBar,
  ListPanel,
  ListSection,
  Sentinel,
  StatusRow,
} from './RequestFeed.styles'
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
  // Fetch the next (older) page when the bottom sentinel nears the viewport.
  const { ref: sentinelRef, inView } = useInView({ rootMargin: '200px' })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

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

        {isLoading && (
          <StatusRow>
            <CircularProgress size={24} />
          </StatusRow>
        )}

        {isError && !isLoading && (
          <StatusRow>
            <Typography variant="body2">Failed to load {noun}.</Typography>
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          </StatusRow>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <StatusRow>
            <Typography variant="body2">
              No {REQUEST_STATUS_META[statusFilter].label.toLowerCase()} {noun}.
            </Typography>
          </StatusRow>
        )}

        {isFetchingNextPage && (
          <StatusRow>
            <CircularProgress size={20} />
          </StatusRow>
        )}

        {hasNextPage && <Sentinel ref={sentinelRef} />}
      </ListPanel>
    </ListSection>
  )
}
