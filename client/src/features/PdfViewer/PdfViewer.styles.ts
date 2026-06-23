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

// Keep pointer events on so the PDF can be scrolled inside the iframe. Replacing
// the file goes through the delete button + empty-state dropzone rather than
// dropping straight over the preview.
export const Frame = styled('iframe')({
  flex: 1,
  width: '100%',
  height: '100%',
  border: 'none',
})
