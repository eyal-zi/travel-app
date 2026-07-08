import { useCallback } from 'react'
import { useSearchParamState } from './useSearchParamState'






export const useTabParam = <T extends string>(allowed: readonly T[], fallback: T) => {
  const [raw, setRaw] = useSearchParamState('tab', { replace: true })
  const tab = allowed.includes(raw as T) ? (raw as T) : fallback

  const setTab = useCallback(
    (next: T) => setRaw(next === fallback ? null : next),
    [setRaw, fallback],
  )

  return [tab, setTab] as const
}
