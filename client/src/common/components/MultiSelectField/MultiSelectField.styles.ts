import { styled } from '@mui/material/styles'

// Sticky group header for the Autocomplete dropdown (rendered via renderGroup).
export const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: theme.spacing(0.75, 2),
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.paper,
  fontSize: theme.typography.overline.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}))

// Option list for a group. `indented` nests grouped options under their header;
// ungrouped options stay flush-left so they read as top-level.
export const GroupItems = styled('ul', {
  shouldForwardProp: (prop) => prop !== 'indented',
})<{ indented?: boolean }>(({ theme, indented }) => ({
  padding: 0,
  ...(indented && { paddingLeft: theme.spacing(2) }),
}))
