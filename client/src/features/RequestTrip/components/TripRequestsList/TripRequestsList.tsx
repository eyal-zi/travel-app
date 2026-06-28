import { RequestFeed } from '../../../../common/components/RequestFeed/RequestFeed'
import { useStatusFilterParam } from '../../../../common/hooks/useStatusFilterParam'
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
  const [statusFilter, setStatusFilter] = useStatusFilterParam(
    admin ? 'received' : 'done',
  )
  const feed = useTripRequests(statusFilter)

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
