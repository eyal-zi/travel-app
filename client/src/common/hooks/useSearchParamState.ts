import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

type Options = {
  // When true (default), updates replace the current history entry instead of
  // pushing a new one — matching the existing useSelectedDate behaviour.
  replace?: boolean
}

/**
 * Reads and writes a single string-valued search param. A parametrized version of
 * useSelectedDate: setting `null` removes the param, keeping URLs clean. Base for
 * the typed param hooks (tab, status, ...). The default history mode can be
 * overridden per call, e.g. to push when opening but replace when closing.
 */
export const useSearchParamState = (param: string, { replace = true }: Options = {}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = searchParams.get(param)

  const setValue = useCallback(
    (next: string | null, options?: Options) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (next) params.set(param, next)
          else params.delete(param)
          return params
        },
        { replace: options?.replace ?? replace },
      )
    },
    [setSearchParams, param, replace],
  )

  return [value, setValue] as const
}
