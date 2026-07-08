import type { SelectOption } from '../types'



export type OptionGroup<T extends SelectOption> = {
  group?: string
  options: T[]
}






export const toOptionGroups = <T extends SelectOption>(
  options: T[],
): OptionGroup<T>[] =>
  options.reduce<OptionGroup<T>[]>((groups, option) => {
    const last = groups[groups.length - 1]
    if (last && last.group === option.group) last.options.push(option)
    else groups.push({ group: option.group, options: [option] })
    return groups
  }, [])
