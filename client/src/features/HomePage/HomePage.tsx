import { format } from 'date-fns'
import Typography from '@mui/material/Typography'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import { Announcements } from '../Announcements/Announcements'
import { Calendar } from '../Calendar/Calendar'
import { RouteMapDropzone } from '../Map/RouteMapDropzone/RouteMapDropzone'
import { PdfDropzone } from '../PdfViewer/PdfDropzone'
import { useAuth } from '../Auth/context/AuthContext'
import {
  AnnouncementsContainer,
  CalendarContainer,
  Greeting,
  GreetingBar,
  MapContainer,
  PageContent,
  PageRoot,
  PanelBody,
  PanelHeader,
  PdfContainer,
  RightColumn,
} from './HomePage.styles'

const getGreeting = (hour: number): string => {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export const HomePage = () => {
  const { user } = useAuth()

  const now = new Date()
  const firstName = user?.firstName || user?.displayName || 'traveller'

  return (
    <PageRoot>
      <GreetingBar>
        <Greeting variant="h5" noWrap>
          {getGreeting(now.getHours())}, {firstName}
        </Greeting>
        <Typography variant="body2" color="text.secondary" noWrap>
          {format(now, 'EEEE, MMMM d')}
        </Typography>
      </GreetingBar>

      <PageContent>
        <MapContainer>
          <PanelHeader>
            <MapRoundedIcon />
            <Typography variant="h6">Route map</Typography>
          </PanelHeader>
          <PanelBody>
            <RouteMapDropzone />
          </PanelBody>
        </MapContainer>

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
          <CalendarContainer>
            <Calendar />
          </CalendarContainer>
          <AnnouncementsContainer>
            <Announcements />
          </AnnouncementsContainer>
        </RightColumn>
      </PageContent>
    </PageRoot>
  )
}
