import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded'

import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import type { SvgIconComponent } from '@mui/icons-material'
import { Announcements } from '../Announcements/Announcements'
import { Calendar } from '../Calendar/Calendar'
import { RouteMapDropzone } from '../Map/RouteMapDropzone/RouteMapDropzone'
import { PdfDropzone } from '../PdfViewer/PdfDropzone'
import { WeatherWidget } from '../Weather/WeatherWidget'
import { ColorModeToggle } from '../../theme/ColorModeToggle'
import { useAuth } from '../Auth/context/AuthContext'
import { isAdmin } from '../Auth/utils/roles'
import {
  ActionCard,
  ActionChevron,
  ActionIcon,
  ActionTitle,
  AnnouncementsContainer,
  Brand,
  CalendarContainer,
  CardSubtitle,
  Greeting,
  HeaderControls,
  MapContainer,
  PageContent,
  PageHeader,
  PageRoot,
  PanelBody,
  PanelHeader,
  PdfContainer,
  QuickActions,
  RightColumn,
  Sidebar,
  TextColumn,
  TripadvisorLogo,
  UserAvatar,
} from './HomePage.styles'

type QuickAction = {
  tone: 'primary' | 'secondary'
  icon: SvgIconComponent
  title: string
  subtitle: string
  to: string
}

const getGreeting = (hour: number): string => {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const getInitials = (first?: string, last?: string, fallback?: string): string => {
  const initials = `${first?.[0] ?? ''}${last?.[0] ?? ''}`.trim()
  return (initials || fallback?.[0] || '?').toUpperCase()
}

export const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const admin = isAdmin(user)

  const now = new Date()
  const firstName = user?.firstName || user?.displayName || 'traveller'
  const initials = getInitials(user?.firstName, user?.lastName, firstName)

  
  const actions: QuickAction[] = admin
    ? [
        {
          tone: 'primary',
          icon: FlightTakeoffRoundedIcon,
          title: 'Trip requests',
          subtitle: 'Review incoming requests',
          to: '/admin/trip-requests',
        },
        {
          tone: 'secondary',
          icon: DatasetRoundedIcon,
          title: 'File requests',
          subtitle: 'Review large-file requests',
          to: '/admin/file-requests',
        },
      ]
    : [
        {
          tone: 'primary',
          icon: FlightTakeoffRoundedIcon,
          title: 'Request a trip',
          subtitle: 'Plan a new journey',
          to: '/request-trip',
        },
        {
          tone: 'secondary',
          icon: DatasetRoundedIcon,
          title: 'Large file request',
          subtitle: 'Ask for a large transfer',
          to: '/large-file-request',
        },
      ]

  return (
    <PageRoot>
      <PageHeader>
        <Brand>
          <TripadvisorLogo aria-label="Tripadvisor" />
          <TextColumn spacing={0.25}>
            <Greeting variant="h5" noWrap>
              {getGreeting(now.getHours())}, {firstName}
            </Greeting>
            <Typography variant="body2" color="text.secondary" noWrap>
              {format(now, 'EEEE, MMMM d')}
            </Typography>
          </TextColumn>
        </Brand>
        <HeaderControls>
          <WeatherWidget />
          <ColorModeToggle />
          <Tooltip title={user?.fullName || user?.email || 'Account'}>
            <UserAvatar>{initials}</UserAvatar>
          </Tooltip>
        </HeaderControls>
      </PageHeader>

      <PageContent>
        <Sidebar>
          <CalendarContainer>
            <Calendar />
          </CalendarContainer>
          <MapContainer>
            <PanelHeader>
              <MapRoundedIcon />
              <Typography variant="h6">Route map</Typography>
            </PanelHeader>
            <PanelBody>
              <RouteMapDropzone />
            </PanelBody>
          </MapContainer>
        </Sidebar>

        <PdfContainer>
          <PanelHeader>
            <PictureAsPdfRoundedIcon />
            <Typography variant="h6">Itinerary</Typography>
          </PanelHeader>
          <PanelBody>
            <PdfDropzone />
          </PanelBody>
        </PdfContainer>

        <RightColumn>
          <AnnouncementsContainer>
            <Announcements />
          </AnnouncementsContainer>
          <QuickActions>
            {actions.map((action) => {
              const Icon = action.icon
              return (
                <ActionCard
                  key={action.to}
                  tone={action.tone}
                  onClick={() => navigate(action.to)}
                >
                  <ActionIcon>
                    <Icon />
                  </ActionIcon>
                  <TextColumn spacing={0.25}>
                    <ActionTitle variant="subtitle1">{action.title}</ActionTitle>
                    <CardSubtitle variant="caption">
                      {action.subtitle}
                    </CardSubtitle>
                  </TextColumn>
                  <ActionChevron>
                    <ChevronRightRoundedIcon />
                  </ActionChevron>
                </ActionCard>
              )
            })}
          </QuickActions>
        </RightColumn>
      </PageContent>
    </PageRoot>
  )
}
