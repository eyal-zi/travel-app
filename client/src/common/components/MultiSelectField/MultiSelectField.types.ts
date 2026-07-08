import type { SelectOption } from '../../types'

export type MultiSelectFieldProps = {
  label: string
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  
  emptyText?: string
  disabled?: boolean
  
  
  
  multiple?: boolean
  
  
  allowCustom?: boolean
  
  helperText?: string
}
