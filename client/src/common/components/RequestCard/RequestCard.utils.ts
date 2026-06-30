import type { SelectOption } from '../../types'

// Resolve a stored value to its human label, falling back to the raw value.
export const labelFor = (options: SelectOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value
