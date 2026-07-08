import { useCallback, useState } from 'react'





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
