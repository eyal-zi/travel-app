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
import {
  AnnouncementsContainer,
  Brand,
  BrandMark,
  CalendarContainer,
  CardSubtitle,
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

  return (
    <PageRoot>
      <PageHeader>
        <Brand>
          <BrandMark>
            <ExploreRoundedIcon />
          </BrandMark>
          <TextColumn spacing={0}>
            <Typography variant="h6" noWrap>
              Trip Planner
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
          <GradientActionCard tone="primary" onClick={() => navigate('/request-trip')}>
            <FlightTakeoffRoundedIcon />
            <TextColumn spacing={0}>
              <Typography variant="subtitle1" noWrap>
                Request a trip
              </Typography>
              <CardSubtitle variant="body2" noWrap>
                Start planning a new itinerary
              </CardSubtitle>
            </TextColumn>
          </GradientActionCard>
          <GradientActionCard tone="secondary" onClick={() => navigate('/large-file-request')}>
            <DatasetRoundedIcon />
            <TextColumn spacing={0}>
              <Typography variant="subtitle1" noWrap>
                Large file request
              </Typography>
              <CardSubtitle variant="body2" noWrap>
                Search files by type, accuracy and area
              </CardSubtitle>
            </TextColumn>
          </GradientActionCard>
        </RightColumn>
      </PageContent>
    </PageRoot>
  )
}
