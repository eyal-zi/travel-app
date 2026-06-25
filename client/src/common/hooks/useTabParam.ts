import { useCallback } from 'react'
import { useSearchParamState } from './useSearchParamState'

/**
 * Drives a page's active tab from the `tab` search param so tabs are linkable and
 * survive reloads. Validates against `allowed` (falling back to `fallback` for a
 * missing/unknown value) and clears the param when the default tab is selected.
 */
export const useTabParam = <T extends string>(allowed: readonly T[], fallback: T) => {
  const [raw, setRaw] = useSearchParamState('tab', { replace: true })
  const tab = allowed.includes(raw as T) ? (raw as T) : fallback

  const setTab = useCallback(
    (next: T) => setRaw(next === fallback ? null : next),
    [setRaw, fallback],
  )

  return [tab, setTab] as const
}
