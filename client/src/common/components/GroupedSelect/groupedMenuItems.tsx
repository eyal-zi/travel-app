import type { ReactNode } from 'react'
import type { SelectOption } from '../../types'
import { toOptionGroups } from '../../utils/selectOptions'
import { CollapsibleSubheader } from '../CollapsibleSubheader/CollapsibleSubheader'




export type OptionRenderContext = { grouped: boolean; hidden: boolean }

type GroupedMenuItemsArgs<T extends SelectOption> = {
  options: T[]
  isCollapsed: (group: string) => boolean
  toggle: (group: string) => void
  renderOption: (option: T, context: OptionRenderContext) => ReactNode
}








export const groupedMenuItems = <T extends SelectOption>({
  options,
  isCollapsed,
  toggle,
  renderOption,
}: GroupedMenuItemsArgs<T>): ReactNode[] =>
  toOptionGroups(options).flatMap((section) => {
    const { group } = section
    const collapsed = group ? isCollapsed(group) : false
    const nodes: ReactNode[] = []
    if (group) {
      nodes.push(
        <CollapsibleSubheader
          key={`group-${group}`}
          label={group}
          collapsed={collapsed}
          onToggle={() => toggle(group)}
        />,
      )
    }
    section.options.forEach((option) => {
      nodes.push(renderOption(option, { grouped: Boolean(group), hidden: collapsed }))
    })
    return nodes
  })
