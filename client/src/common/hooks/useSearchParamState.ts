import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

type Options = {
  
  
  replace?: boolean
}







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
