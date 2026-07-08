import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'



export const PdfRoot = styled(Box)({
  position: 'relative',
  flex: 1,
  width: '100%',
  minHeight: 0,
  display: 'flex',
})

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  right: theme.spacing(1.5),
  zIndex: 1,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[4],
  '&:hover': { backgroundColor: theme.palette.action.hover },
}))
