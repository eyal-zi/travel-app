import type { SelectOption } from '../../types'

export type MultiSelectFieldProps = {
  label: string
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  // Placeholder shown when nothing is selected.
  emptyText?: string
  disabled?: boolean
  // When set, appends an "Other…" option that reveals a free-text input whose
  // comma-separated values are surfaced as chips. Requires otherText/onOtherTextChange.
  allowOther?: boolean
  otherText?: string
  onOtherTextChange?: (text: string) => void
  otherLabel?: string
  otherPlaceholder?: string
  otherHelperText?: string
}
