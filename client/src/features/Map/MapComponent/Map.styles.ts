import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const MapRoot = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  minHeight: 0,
  overflow: 'hidden',
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  border: `1px solid ${theme.palette.divider}`,

  '& .leaflet-container': {
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background.default,
    fontFamily: theme.typography.fontFamily,
  },
}))
