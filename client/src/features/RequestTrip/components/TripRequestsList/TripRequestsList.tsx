import { RequestFeed } from '../../../../common/components/RequestFeed/RequestFeed'
import { useStatusFilterParam } from '../../../../common/hooks/useStatusFilterParam'
import { useTripRequests } from '../../queries/useTripRequests'
import { TripRequestItem } from '../TripRequestItem/TripRequestItem'

type TripRequestsListProps = {
  
  admin?: boolean
}






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
