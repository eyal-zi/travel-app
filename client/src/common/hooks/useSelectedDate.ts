import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const PARAM = 'date'

export const useSelectedDate = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedDate = searchParams.get(PARAM)

  const setSelectedDate = useCallback(
    (date: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (date) next.set(PARAM, date)
          else next.delete(PARAM)
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return [selectedDate, setSelectedDate] as const
}
