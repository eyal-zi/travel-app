import { useCallback, useState } from 'react'

/**
 * Tracks which option groups are collapsed in a grouped select. Groups start
 * open; `toggle` flips a single group and `isCollapsed` reports its state.
 */
export const useCollapsibleGroups = () => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const isCollapsed = useCallback(
    (group: string) => Boolean(collapsed[group]),
    [collapsed],
  )

  const toggle = useCallback(
    (group: string) =>
      setCollapsed((prev) => ({ ...prev, [group]: !prev[group] })),
    [],
  )

  return { isCollapsed, toggle }
}
