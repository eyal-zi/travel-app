import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded'
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded'
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded'
import { Announcements } from '../Announcements/Announcements'
import { Calendar } from '../Calendar/Calendar'
import { RouteMapDropzone } from '../Map/RouteMapDropzone/RouteMapDropzone'
import { PdfDropzone } from '../PdfViewer/PdfDropzone'
import { WeatherWidget } from '../Weather/WeatherWidget'
import { ColorModeToggle } from '../../theme/ColorModeToggle'
import { useAuth } from '../Auth/AuthContext'
import { isAdmin } from '../Auth/roles'
import {
  AnnouncementsContainer,
  Brand,
  BrandMark,
  CalendarContainer,
  GradientActionCard,
  HeaderControls,
  MapContainer,
  PageContent,
  PageHeader,
  PageRoot,
  PdfContainer,
  RightColumn,
  Sidebar,
  TextColumn,
} from './HomePage.styles'

export const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const admin = isAdmin(user)

  return (
    <PageRoot>
      <PageHeader>
        <Brand>
          <BrandMark>
            <ExploreRoundedIcon />
          </BrandMark>
          <TextColumn spacing={0}>
            <Typography variant="h6" noWrap>
              Trip Advisor
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Plan your itinerary, map, and documents in one place
            </Typography>
          </TextColumn>
        </Brand>
        <HeaderControls>
          <WeatherWidget />
          <ColorModeToggle />
        </HeaderControls>
      </PageHeader>
      <PageContent>
        <Sidebar>
          <CalendarContainer>
            <Calendar />
          </CalendarContainer>
          <MapContainer>
            <RouteMapDropzone />
          </MapContainer>
        </Sidebar>
        <PdfContainer>
          <PdfDropzone />
        </PdfContainer>
        <RightColumn>
          <AnnouncementsContainer>
            <Announcements />
          </AnnouncementsContainer>
          <GradientActionCard
            tone="primary"
            onClick={() =>
              navigate(admin ? '/admin/trip-requests' : '/request-trip')
            }
          >
            <FlightTakeoffRoundedIcon />
            <TextColumn spacing={0}>
              <Typography variant="subtitle1" noWrap>
                Request a trip
              </Typography>
            </TextColumn>
          </GradientActionCard>
          <GradientActionCard
            tone="secondary"
            onClick={() =>
              navigate(admin ? '/admin/file-requests' : '/large-file-request')
            }
          >
            <DatasetRoundedIcon />
            <TextColumn spacing={0}>
              <Typography variant="subtitle1" noWrap>
                Large file request
              </Typography>
            </TextColumn>
          </GradientActionCard>
        </RightColumn>
      </PageContent>
    </PageRoot>
  )
}
