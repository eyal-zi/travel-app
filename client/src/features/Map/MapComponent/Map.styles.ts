import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

/**
 * Parent-filling shell for the Leaflet map. A `MapContainer` renders nothing
 * without an explicitly sized parent, so this wrapper provides the height/width
 * and clips the tiles to the rounded border (`overflow: hidden`). Mirrors the
 * chrome of `CalendarRoot` so the two surfaces read as a set.
 */
export const MapRoot = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  minHeight: 0,
  overflow: 'hidden',
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  border: `1px solid ${theme.palette.divider}`,

  // The Leaflet map fills this shell.
  '& .leaflet-container': {
    height: '100%',
    width: '100%',
    backgroundColor: theme.palette.background.default,
    fontFamily: theme.typography.fontFamily,
  },
}))
