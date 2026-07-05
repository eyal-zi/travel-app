import ListSubheader from '@mui/material/ListSubheader'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { SubheaderButton } from './CollapsibleSubheader.styles'

type CollapsibleSubheaderProps = {
  label: string
  collapsed: boolean
  onToggle: () => void
}

/**
 * A group subheader for a MUI Select whose options can be collapsed. The toggle
 * lives on an inner ButtonBase and stops propagation, because MUI's Select
 * rewrites the ListSubheader root's onClick for option selection and skips
 * non-focusable rows — so a handler on the root would never fire.
 */
export const CollapsibleSubheader = ({
  label,
  collapsed,
  onToggle,
}: CollapsibleSubheaderProps) => (
  <ListSubheader disableSticky disableGutters>
    <SubheaderButton
      aria-expanded={!collapsed}
      onClick={(event) => {
        event.stopPropagation()
        onToggle()
      }}
    >
      {label}
      {collapsed ? (
        <ExpandMoreRoundedIcon fontSize="small" />
      ) : (
        <ExpandLessRoundedIcon fontSize="small" />
      )}
    </SubheaderButton>
  </ListSubheader>
)
