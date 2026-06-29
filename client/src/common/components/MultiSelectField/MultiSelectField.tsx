import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { OTHER_FILE_TYPE } from '../../constants/fileTypes'
import { ChipRow, OtherFieldWrap } from './MultiSelectField.styles'
import { parseOtherValues } from './MultiSelectField.utils'
import type { MultiSelectFieldProps } from './MultiSelectField.types'

/**
 * A reusable multi-select with chip display and an optional "Other…" free-text
 * input rendered inside the menu. Shared by the large-file search and the
 * new-file request forms.
 */
export const MultiSelectField = ({
  label,
  options,
  value,
  onChange,
  emptyText = 'Any',
  disabled,
  allowOther = false,
  otherText = '',
  onOtherTextChange,
  otherLabel = 'Other…',
  otherPlaceholder = 'e.g. geotiff, netcdf',
  otherHelperText = 'Comma-separated, included alongside the selected options.',
}: MultiSelectFieldProps) => {
  const allOptions = allowOther
    ? [...options, { value: OTHER_FILE_TYPE, label: otherLabel }]
    : options

  const labelFor = (item: string) =>
    allOptions.find((option) => option.value === item)?.label ?? item

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const next = event.target.value
    onChange(typeof next === 'string' ? next.split(',') : next)
  }

  // Flat list of menu children; the "Other" input is injected right after its
  // option. Kept flat (not nested arrays) so Select's value typing stays intact.
  const menuItems = allOptions.flatMap((option) => {
    const items = [
      <MenuItem key={option.value} value={option.value}>
        <Checkbox checked={value.includes(option.value)} />
        <ListItemText primary={option.label} />
      </MenuItem>,
    ]
    if (
      allowOther &&
      option.value === OTHER_FILE_TYPE &&
      value.includes(OTHER_FILE_TYPE)
    ) {
      items.push(
        // Lives inside the menu, so we stop key/click events from reaching the
        // Select (which would otherwise close the menu, type-ahead, or move focus).
        <OtherFieldWrap
          key={`${option.value}-input`}
          onClickCapture={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <TextField
            fullWidth
            size="small"
            autoFocus
            label={otherLabel}
            value={otherText}
            onChange={(event) => onOtherTextChange?.(event.target.value)}
            placeholder={otherPlaceholder}
            helperText={otherHelperText}
          />
        </OtherFieldWrap>,
      )
    }
    return items
  })

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel shrink>{label}</InputLabel>
      <Select
        multiple
        displayEmpty
        value={value}
        onChange={handleChange}
        input={<OutlinedInput notched label={label} />}
        renderValue={(selected) =>
          selected.length === 0 ? (
            <Typography component="span" color="text.secondary">
              {emptyText}
            </Typography>
          ) : (
            <ChipRow>
              {selected.flatMap((item) => {
                // Show the typed custom values as chips instead of "Other…".
                if (allowOther && item === OTHER_FILE_TYPE) {
                  const customs = parseOtherValues(otherText)
                  return customs.length
                    ? customs.map((custom) => (
                        <Chip key={`other-${custom}`} size="small" label={custom} />
                      ))
                    : [<Chip key={item} size="small" label={labelFor(item)} />]
                }
                return [<Chip key={item} size="small" label={labelFor(item)} />]
              })}
            </ChipRow>
          )
        }
      >
        {menuItems}
      </Select>
    </FormControl>
  )
}
