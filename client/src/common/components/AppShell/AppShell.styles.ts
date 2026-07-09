import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { TripadvisorLogoSvg } from '../../../features/HomePage/TripadvisorLogoSvg'

export const ShellRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100svh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default,
}))

export const TopNav = styled('header')(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  height: 60,
  padding: theme.spacing(0, 3),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1.5),
    padding: theme.spacing(0, 2),
  },
}))

export const Brand = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  flexShrink: 0,
  color: theme.palette.text.primary,
}))

export const TripadvisorLogo = styled(TripadvisorLogoSvg)(({ theme }) => ({
  flexShrink: 0,
  height: 26,
  width: 'auto',
  color: theme.palette.text.primary,
}))

export const NavLinks = styled('nav')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  minWidth: 0,
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
}))

export const NavItem = styled('button', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  flexShrink: 0,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.9375rem',
  fontWeight: 600,
  padding: theme.spacing(0.75, 1.75),
  borderRadius: 999,
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  transition: theme.transitions.create(['background-color', 'color']),
  '& svg': { fontSize: 19 },
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
}))

export const Spacer = styled(Box)({
  flex: 1,
  minWidth: 0,
})

export const NavControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexShrink: 0,
}))

export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 36,
  height: 36,
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
}))

export const Main = styled('main')({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
})
