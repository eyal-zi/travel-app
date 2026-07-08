import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'




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
