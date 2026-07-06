import type { SelectOption } from '../../types'

export type MultiSelectFieldProps = {
  label: string
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  // Placeholder shown when nothing is selected.
  emptyText?: string
  disabled?: boolean
  // When false, the field is a single-select: one value at a time, shown as
  // plain text (no chips/checkboxes) and replaced on each pick. `value` still
  // holds at most one entry. Defaults to true (multi-select with chips).
  multiple?: boolean
  // When set, arbitrary typed values can be added alongside the listed options
  // (MUI Autocomplete `freeSolo`); they become chips in `value` like any other.
  allowCustom?: boolean
  // Optional hint rendered under the field.
  helperText?: string
}
