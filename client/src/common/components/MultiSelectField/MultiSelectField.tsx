import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import { GroupHeader, GroupItems } from './MultiSelectField.styles'
import type { MultiSelectFieldProps } from './MultiSelectField.types'









export const MultiSelectField = ({
  label,
  options,
  value,
  onChange,
  emptyText = 'Any',
  disabled,
  allowCustom = false,
  multiple = true,
  helperText,
}: MultiSelectFieldProps) => {
  const optionValues = options.map((option) => option.value)
  const labelFor = (item: string) =>
    options.find((option) => option.value === item)?.label ?? item

  
  
  const hasGroups = options.some((option) => option.group)
  const groupFor = (item: string) =>
    options.find((option) => option.value === item)?.group ?? ''

  
  
  const singleValue = value[0] ?? null

  return (
    <Autocomplete
      multiple={multiple}
      fullWidth
      disableCloseOnSelect={multiple}
      freeSolo={allowCustom}
      disabled={disabled}
      options={optionValues}
      value={multiple ? value : singleValue}
      onChange={(_event, next) =>
        onChange(
          multiple
            ? (next as string[])
            : next
              ? [next as string]
              : [],
        )
      }
      getOptionLabel={labelFor}
      groupBy={hasGroups ? groupFor : undefined}
      renderGroup={
        hasGroups
          ? (params) => (
              <li key={params.key}>
                {

}
                {params.group && <GroupHeader>{params.group}</GroupHeader>}
                <GroupItems indented={Boolean(params.group)}>
                  {params.children}
                </GroupItems>
              </li>
            )
          : undefined
      }
      renderOption={(props, option, { selected }) => {
        const { key, ...liProps } = props
        return (
          <li key={key} {...liProps}>
            {}
            {multiple && (
              <Checkbox size="small" checked={selected} sx={{ mr: 1 }} />
            )}
            {labelFor(option)}
          </li>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={value.length === 0 ? emptyText : undefined}
          helperText={helperText}
        />
      )}
    />
  )
}
