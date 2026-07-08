import { useCallback } from 'react'
import type { StatusFilter } from '../components/RequestFeed/RequestFeed.types'
import { REQUEST_STATUSES } from '../requests/requestStatus'
import { useSearchParamState } from './useSearchParamState'







export const useStatusFilterParam = (defaultStatus: StatusFilter) => {
  const [raw, setRaw] = useSearchParamState('status', { replace: true })
  const statusFilter: StatusFilter =
    raw && (REQUEST_STATUSES as readonly string[]).includes(raw)
      ? (raw as StatusFilter)
      : defaultStatus

  const setStatusFilter = useCallback(
    (next: StatusFilter) => setRaw(next === defaultStatus ? null : next),
    [setRaw, defaultStatus],
  )

  return [statusFilter, setStatusFilter] as const
}
