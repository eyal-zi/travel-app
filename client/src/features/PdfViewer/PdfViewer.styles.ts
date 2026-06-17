import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const ViewerRoot = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}))

export const Frame = styled('iframe')({
  flex: 1,
  width: '100%',
  height: '100%',
  border: 'none',
})
