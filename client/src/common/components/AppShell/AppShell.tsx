import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded'
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded'
import type { SvgIconComponent } from '@mui/icons-material'
import { WeatherWidget } from '../../../features/Weather/WeatherWidget'
import { ColorModeToggle } from '../../../theme/ColorModeToggle'
import { useAuth } from '../../../features/Auth/context/AuthContext'
import { isAdmin } from '../../../features/Auth/utils/roles'
import {
  Brand,
  Main,
  NavControls,
  NavItem,
  NavLinks,
  ShellRoot,
  Spacer,
  TopNav,
  TripadvisorLogo,
  UserAvatar,
} from './AppShell.styles'

type NavLink = {
  label: string
  icon: SvgIconComponent
  to: string
  // Pathname prefixes that should mark this link active.
  match: string[]
}

const getInitials = (first?: string, last?: string, fallback?: string): string => {
  const initials = `${first?.[0] ?? ''}${last?.[0] ?? ''}`.trim()
  return (initials || fallback?.[0] || '?').toUpperCase()
}

const getNavLinks = (admin: boolean): NavLink[] => [
  { label: 'Home', icon: HomeRoundedIcon, to: '/', match: ['/'] },
  {
    label: 'Trip request',
    icon: FlightTakeoffRoundedIcon,
    to: admin ? '/admin/trip-requests' : '/request-trip',
    match: ['/request-trip', '/admin/trip-requests'],
  },
  {
    label: 'File request',
    icon: DatasetRoundedIcon,
    to: admin ? '/admin/file-requests' : '/large-file-request',
    match: ['/large-file-request', '/admin/file-requests'],
  },
]

const isActive = (pathname: string, match: string[]): boolean =>
  match.some((path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path),
  )

export const AppShell = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useAuth()
  const admin = isAdmin(user)

  const links = getNavLinks(admin)
  const fallbackName = user?.firstName || user?.displayName || 'traveller'
  const initials = getInitials(user?.firstName, user?.lastName, fallbackName)

  return (
    <ShellRoot>
      <TopNav>
        <Brand>
          <TripadvisorLogo aria-label="Tripadvisor" />
        </Brand>

        <NavLinks aria-label="Primary">
          {links.map((link) => {
            const Icon = link.icon
            const active = isActive(pathname, link.match)
            return (
              <NavItem
                key={link.label}
                type="button"
                active={active}
                aria-current={active ? 'page' : undefined}
                onClick={() => navigate(link.to)}
              >
                <Icon />
                {link.label}
              </NavItem>
            )
          })}
        </NavLinks>

        <Spacer />

        <NavControls>
          <WeatherWidget />
          <ColorModeToggle />
          <Tooltip title={user?.fullName || user?.email || 'Account'}>
            <UserAvatar>{initials}</UserAvatar>
          </Tooltip>
        </NavControls>
      </TopNav>

      <Main>
        <Outlet />
      </Main>
    </ShellRoot>
  )
}
