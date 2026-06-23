import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Drop target shown once a file is selected: it stays mounted so a new file can
// be dropped to replace the current one. Stretches its single child to fill the
// area (e.g. a PDF iframe), while `minHeight` lets consumers floor the height.
export const PreviewFrame = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'minHeight',
})<{ minHeight?: number }>(({ minHeight }) => ({
  display: 'flex',
  alignItems: 'stretch',
  width: '100%',
  height: '100%',
  ...(minHeight ? { minHeight } : null),
  '& > *': { flex: 1, minWidth: 0 },
}))

// Centered frame for the loading spinner.
export const LoadingFrame = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'minHeight',
})<{ minHeight?: number }>(({ minHeight }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  ...(minHeight ? { minHeight } : null),
}))

// Empty-state drop target shown before a file is selected. `isDragActive`
// drives the hover styling while a file is dragged over the dropzone.
export const DropPrompt = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragActive' && prop !== 'minHeight',
})<{ isDragActive: boolean; minHeight?: number }>(
  ({ theme, isDragActive, minHeight }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    width: '100%',
    height: '100%',
    minHeight: minHeight ?? 0,
    padding: theme.spacing(4),
    cursor: 'pointer',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: `2px dashed ${
      isDragActive ? theme.palette.primary.main : theme.palette.divider
    }`,
    borderRadius: 12,
    backgroundColor: isDragActive ? theme.palette.action.hover : 'transparent',
    transition: theme.transitions.create(['border-color', 'background-color'], {
      duration: theme.transitions.duration.shorter,
    }),
    '& svg': { fontSize: 48 },
  }),
)
