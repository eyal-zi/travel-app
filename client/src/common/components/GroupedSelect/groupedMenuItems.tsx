import type { ReactNode } from 'react'
import type { SelectOption } from '../../types'
import { toOptionGroups } from '../../utils/selectOptions'
import { CollapsibleSubheader } from '../CollapsibleSubheader/CollapsibleSubheader'

// Context handed to each option renderer: whether the option belongs to a group
// (so it can be indented) and whether that group is currently collapsed (so it
// can be hidden while kept mounted).
export type OptionRenderContext = { grouped: boolean; hidden: boolean }

type GroupedMenuItemsArgs<T extends SelectOption> = {
  options: T[]
  isCollapsed: (group: string) => boolean
  toggle: (group: string) => void
  renderOption: (option: T, context: OptionRenderContext) => ReactNode
}

/**
 * Builds the children for a MUI Select whose options are split into collapsible
 * groups. Returns a flat element array (not a wrapper component) because Select
 * introspects its direct children — so the caller spreads the result straight
 * into the Select. Group headers are rendered here; each option is delegated to
 * `renderOption`, which owns the single- vs multi-select item markup.
 */
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
