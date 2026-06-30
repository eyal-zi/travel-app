import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const Root = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
})

export const Header = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  '& svg': { color: theme.palette.primary.main },
}))

// Scrollable, newest-first message list. Grows to fill the panel; the composer
// stays pinned below it.
export const List = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.text.disabled} transparent`,
  '&::-webkit-scrollbar': {
    width: 8,
    height: 8,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.text.disabled,
    borderRadius: 8,
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: theme.palette.text.secondary,
  },
}))

// Bottom sentinel observed for infinite scroll; zero-height so it doesn't
// affect layout.
export const Sentinel = styled(Box)({
  height: 1,
  flexShrink: 0,
})

export const Composer = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
}))
