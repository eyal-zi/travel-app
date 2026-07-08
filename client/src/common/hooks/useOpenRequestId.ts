import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const PARAM = 'request'






export const useOpenRequestId = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const openId = searchParams.get(PARAM)

  const openRequest = useCallback(
    (id: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(PARAM, id)
          return next
        },
        { replace: false },
      )
    },
    [setSearchParams],
  )

  const closeRequest = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete(PARAM)
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

  return { openId, openRequest, closeRequest }
}
