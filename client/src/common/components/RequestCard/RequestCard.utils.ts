import type { SelectOption } from '../../types'


export const labelFor = (options: SelectOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value
