import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const PARAM = 'request'

/**
 * Tracks which request dialog is open via the `request` search param, so a request
 * is deep-linkable. Opening pushes a history entry (browser Back closes the dialog);
 * closing replaces it, so dismissing via the X leaves no stray entry behind.
 */
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
