import { styled } from '@mui/material/styles'
import ButtonBase from '@mui/material/ButtonBase'

// The clickable row inside a collapsible group subheader. Built on ButtonBase
// (MUI's unstyled clickable primitive) so it keeps ripple, focus-visible and
// keyboard handling without Button's chrome. It lives on an inner element rather
// than the ListSubheader root because MUI's Select rewrites the root's onClick
// for option selection.
export const SubheaderButton = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: theme.spacing(0.5, 2),
  font: 'inherit',
  color: theme.palette.text.secondary,
  textAlign: 'left',
}))
