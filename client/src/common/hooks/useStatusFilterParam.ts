import { useCallback } from 'react'
import type { StatusFilter } from '../components/RequestFeed/RequestFeed.types'
import { REQUEST_STATUSES } from '../requests/requestStatus'
import { useSearchParamState } from './useSearchParamState'

/**
 * Drives a request feed's status filter from the `status` search param so filtered
 * views are linkable. Validates against REQUEST_STATUSES (falling back to 'all') and
 * clears the param for 'all'. Returns the same [value, setter] shape the lists pass
 * to RequestFeed.
 */
export const useStatusFilterParam = () => {
  const [raw, setRaw] = useSearchParamState('status', { replace: true })
  const statusFilter: StatusFilter =
    raw && (REQUEST_STATUSES as readonly string[]).includes(raw)
      ? (raw as StatusFilter)
      : 'all'

  const setStatusFilter = useCallback(
    (next: StatusFilter) => setRaw(next === 'all' ? null : next),
    [setRaw],
  )

  return [statusFilter, setStatusFilter] as const
}
