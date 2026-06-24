import { useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack'
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
import {
  AnnouncementsContainer,
  Brand,
  BrandMark,
  CalendarContainer,
  HeaderControls,
  LargeFileRequestCard,
  MapContainer,
  PageContent,
  PageHeader,
  PageRoot,
  PdfContainer,
  RightColumn,
  Sidebar,
  TripRequestCard,
} from './HomePage.styles'

export const HomePage = () => {
  const navigate = useNavigate()

  return (
    <PageRoot>
      <PageHeader>
        <Brand>
          <BrandMark>
            <ExploreRoundedIcon />
          </BrandMark>
          <Stack spacing={0} sx={{ minWidth: 0 }}>
            <Typography variant="h6" noWrap>
              Trip Planner
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Plan your itinerary, map, and documents in one place
            </Typography>
          </Stack>
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
          <TripRequestCard onClick={() => navigate('/request-trip')}>
            <FlightTakeoffRoundedIcon />
            <Stack spacing={0} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                Request a trip
              </Typography>
              <Typography variant="body2" noWrap sx={{ opacity: 0.85 }}>
                Start planning a new itinerary
              </Typography>
            </Stack>
          </TripRequestCard>
          <LargeFileRequestCard onClick={() => navigate('/large-file-request')}>
            <DatasetRoundedIcon />
            <Stack spacing={0} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" noWrap>
                Large file request
              </Typography>
              <Typography variant="body2" noWrap sx={{ opacity: 0.85 }}>
                Search files by type, accuracy and area
              </Typography>
            </Stack>
          </LargeFileRequestCard>
        </RightColumn>
      </PageContent>
    </PageRoot>
  )
}
