import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import type { SelectOption } from '../../types'
import { useCollapsibleGroups } from '../../hooks/useCollapsibleGroups'
import { groupedMenuItems } from '../GroupedSelect/groupedMenuItems'

export type SelectFieldProps = {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label?: string
  disabled?: boolean
  size?: 'small' | 'medium'
  fullWidth?: boolean
}






export const SelectField = ({
  value,
  onChange,
  options,
  label,
  disabled,
  size = 'small',
  fullWidth = true,
}: SelectFieldProps) => {
  const { isCollapsed, toggle } = useCollapsibleGroups()

  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      size={size}
      fullWidth={fullWidth}
    >
      {groupedMenuItems({
        options,
        isCollapsed,
        toggle,
        renderOption: (option, { grouped, hidden }) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              ...(grouped ? { pl: 4 } : {}),
              ...(hidden ? { display: 'none' } : {}),
            }}
          >
            {option.label}
          </MenuItem>
        ),
      })}
    </TextField>
  )
}
