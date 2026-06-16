import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

/**
 * Positioning context for the map and its drag overlay. Fills the parent like
 * the bare `Map` does, so dropping it in place of `<Map />` needs no layout
 * changes.
 */
export const DropzoneRoot = styled(Box)({
  position: 'relative',
  height: '100%',
  width: '100%',
  minHeight: 0,
})

/**
 * Full-cover overlay shown only while a file is dragged over the map, prompting
 * the user to drop. Sits above the Leaflet panes (which use z-index up to ~700)
 * and ignores pointer events so it never interferes with the drop itself.
 */
export const DragOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  zIndex: 1000,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  border: `2px dashed ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.action.hover,
  backdropFilter: 'blur(1px)',
  color: theme.palette.primary.main,
  font: 'inherit',
  fontWeight: theme.typography.fontWeightMedium,
}))

/**
 * Floating Save/Cancel bar shown over the map after a file is drawn but not yet
 * committed. Pinned bottom-centre above the Leaflet panes; a frosted surface so
 * it reads as a card detached from the map beneath it.
 */
/**
 * Floating panel listing the drawn layers, each with a delete control. Pinned
 * top-right above the Leaflet panes; same card treatment as {@link ActionBar}.
 */
export const LayerPanel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  minWidth: 200,
  maxWidth: 280,
  overflow: 'hidden',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[6],
}))

/**
 * Floating Save/Cancel bar shown over the map after a file is drawn but not yet
 * committed. Pinned bottom-centre above the Leaflet panes; a frosted surface so
 * it reads as a card detached from the map beneath it.
 */
export const ActionBar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2.5),
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75),
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[8],
}))
