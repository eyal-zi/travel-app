import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const PARAM = 'date'

/**
 * Selected day (`yyyy-MM-dd`) stored in the URL's `date` search param.
 *
 * Backed by the router's search params, so every consumer reads the same
 * source and re-renders when it changes — it behaves like shared state
 * without any extra context or store. Returns a `[value, setter]` tuple,
 * mirroring `useState`.
 */
export const useSelectedDate = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedDate = searchParams.get(PARAM) // string | null

  const setSelectedDate = useCallback(
    (date: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (date) next.set(PARAM, date)
          else next.delete(PARAM)
          return next
        },
        // Don't pollute browser history on every day click.
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return [selectedDate, setSelectedDate] as const
}
