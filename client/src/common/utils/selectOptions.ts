import type { SelectOption } from '../types'

// A contiguous run of options sharing the same (optional) group. `group` is
// undefined for ungrouped options, which render at the top level of a select.
export type OptionGroup<T extends SelectOption> = {
  group?: string
  options: T[]
}

/**
 * Splits a flat option list into contiguous sections by each option's `group`.
 * Order is preserved, so options must already be sorted with grouped entries
 * adjacent. Consumers render a subheader for sections that have a `group`.
 */
export const toOptionGroups = <T extends SelectOption>(
  options: T[],
): OptionGroup<T>[] =>
  options.reduce<OptionGroup<T>[]>((groups, option) => {
    const last = groups[groups.length - 1]
    if (last && last.group === option.group) last.options.push(option)
    else groups.push({ group: option.group, options: [option] })
    return groups
  }, [])
