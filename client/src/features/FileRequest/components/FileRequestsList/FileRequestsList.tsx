import { RequestFeed } from '../../../../common/components/RequestFeed/RequestFeed'
import { useStatusFilterParam } from '../../../../common/hooks/useStatusFilterParam'
import { useFileRequests } from '../../queries/useFileRequests'
import { FileRequestItem } from '../FileRequestItem/FileRequestItem'

type FileRequestsListProps = {
  
  admin?: boolean
}






export const FileRequestsList = ({ admin }: FileRequestsListProps) => {
  const [statusFilter, setStatusFilter] = useStatusFilterParam(
    admin ? 'received' : 'done',
  )
  const feed = useFileRequests(statusFilter)

  return (
    <RequestFeed
      {...feed}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      getItemKey={(request) => request.id}
      renderItem={(request) => (
        <FileRequestItem request={request} admin={admin} />
      )}
      noun="file requests"
    />
  )
}
