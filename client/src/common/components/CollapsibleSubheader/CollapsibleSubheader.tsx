import ListSubheader from '@mui/material/ListSubheader'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { SubheaderButton } from './CollapsibleSubheader.styles'

type CollapsibleSubheaderProps = {
  label: string
  collapsed: boolean
  onToggle: () => void
}







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
