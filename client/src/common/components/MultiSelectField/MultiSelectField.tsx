import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import { GroupHeader, GroupItems } from './MultiSelectField.styles'
import type { MultiSelectFieldProps } from './MultiSelectField.types'

/**
 * A searchable select built on MUI Autocomplete: type to filter, and options
 * carrying a `group` are shown under a group header. In the default multi mode
 * selected values show as chips; with `multiple={false}` it is a single-select
 * that shows one plain value and replaces it on each pick. With `allowCustom`,
 * arbitrary typed values can be added (freeSolo) and live in `value` alongside
 * the listed options. Shared by the large-file search, request and admin forms.
 */
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

  // Only group when the options actually declare groups; otherwise Autocomplete
  // would render an empty header for the ungrouped list.
  const hasGroups = options.some((option) => option.group)
  const groupFor = (item: string) =>
    options.find((option) => option.value === item)?.group ?? ''

  // The array `value`/`onChange` API is uniform across both modes; single-select
  // just carries at most one entry and maps to/from Autocomplete's scalar value.
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
                {/* Ungrouped options report an empty group — skip the header and
                    keep them flush-left; grouped options are indented so they
                    read as belonging under their header. */}
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
            {/* Checkboxes signal multi-select; the single-select mode omits them. */}
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
