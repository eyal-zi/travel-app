import { styled } from '@mui/material/styles'
import ButtonBase from '@mui/material/ButtonBase'






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
