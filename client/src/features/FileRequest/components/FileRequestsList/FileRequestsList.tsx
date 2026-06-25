import { useState } from 'react'
import { RequestFeed } from '../../../../common/components/RequestFeed/RequestFeed'
import type { StatusFilter } from '../../../../common/components/RequestFeed/RequestFeed.types'
import { useFileRequests } from '../../queries/useFileRequests'
import { FileRequestItem } from '../FileRequestItem/FileRequestItem'

type FileRequestsListProps = {
  // When true, each card opens the response dialog in admin (editor) mode.
  admin?: boolean
}

/**
 * The file-requests feed. Owns the status-filter state that drives its query and
 * delegates the list chrome (filter bar, infinite scroll, states) to RequestFeed.
 * Pass `admin` to expose status/response editing on each card.
 */
export const FileRequestsList = ({ admin }: FileRequestsListProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const feed = useFileRequests(statusFilter === 'all' ? undefined : statusFilter)

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
