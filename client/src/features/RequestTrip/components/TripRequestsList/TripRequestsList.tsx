import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useTripRequests } from '../../queries/useTripRequests'
import { TRIP_REQUEST_STATUSES, type TripRequestStatus } from '../../types'
import { TripRequestItem } from '../TripRequestItem/TripRequestItem'
import { STATUS_META } from '../TripRequestItem/statusMeta'
import {
  FilterBar,
  ListPanel,
  ListSection,
  Sentinel,
  StatusRow,
} from '../../RequestTrip.styles'

type StatusFilter = TripRequestStatus | 'all'

type TripRequestsListProps = {
  // When true, each card renders admin status-transition controls.
  admin?: boolean
}

/**
 * Newest-first, cursor-paginated trip-requests feed with infinite scroll and a
 * status filter. Owns its own query and filter state, so the page just has to
 * mount it. Pass `admin` to expose status-change controls on each card.
 */
export const TripRequestsList = ({ admin }: TripRequestsListProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const {
    items,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useTripRequests(statusFilter === 'all' ? undefined : statusFilter)

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
        <Chip
          label="All"
          color={statusFilter === 'all' ? 'primary' : 'default'}
          variant={statusFilter === 'all' ? 'filled' : 'outlined'}
          onClick={() => setStatusFilter('all')}
        />
        {TRIP_REQUEST_STATUSES.map((value) => (
          <Chip
            key={value}
            label={STATUS_META[value].label}
            color={statusFilter === value ? STATUS_META[value].color : 'default'}
            variant={statusFilter === value ? 'filled' : 'outlined'}
            onClick={() => setStatusFilter(value)}
          />
        ))}
      </FilterBar>

      <ListPanel>
        {items.map((request) => (
          <TripRequestItem key={request.id} request={request} admin={admin} />
        ))}

        {isLoading && (
          <StatusRow>
            <CircularProgress size={24} />
          </StatusRow>
        )}

        {isError && !isLoading && (
          <StatusRow sx={{ flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">Failed to load trip requests.</Typography>
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          </StatusRow>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <StatusRow>
            <Typography variant="body2">
              {statusFilter === 'all'
                ? 'No trip requests yet.'
                : `No ${STATUS_META[statusFilter].label.toLowerCase()} trip requests.`}
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
