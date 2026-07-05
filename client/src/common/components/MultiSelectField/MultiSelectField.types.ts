import type { SelectOption } from '../../types'

export type MultiSelectFieldProps = {
  label: string
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  // Placeholder shown when nothing is selected.
  emptyText?: string
  disabled?: boolean
  // When set, arbitrary typed values can be added alongside the listed options
  // (MUI Autocomplete `freeSolo`); they become chips in `value` like any other.
  allowCustom?: boolean
  // Optional hint rendered under the field.
  helperText?: string
}
