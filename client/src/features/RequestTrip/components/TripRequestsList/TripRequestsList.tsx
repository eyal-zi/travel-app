import { useState } from 'react'
import { RequestFeed } from '../../../../common/components/RequestFeed/RequestFeed'
import type { StatusFilter } from '../../../../common/components/RequestFeed/RequestFeed.types'
import { useTripRequests } from '../../queries/useTripRequests'
import { TripRequestItem } from '../TripRequestItem/TripRequestItem'

type TripRequestsListProps = {
  // When true, each card renders admin status-transition controls.
  admin?: boolean
}

/**
 * The trip-requests feed. Owns the status-filter state that drives its query and
 * delegates the list chrome (filter bar, infinite scroll, states) to RequestFeed.
 * Pass `admin` to expose status-change controls on each card.
 */
export const TripRequestsList = ({ admin }: TripRequestsListProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const feed = useTripRequests(statusFilter === 'all' ? undefined : statusFilter)

  return (
    <RequestFeed
      {...feed}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      getItemKey={(request) => request.id}
      renderItem={(request) => (
        <TripRequestItem request={request} admin={admin} />
      )}
      noun="trip requests"
    />
  )
}
