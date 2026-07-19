import Typography from '@mui/material/Typography'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import { Announcements } from '../Announcements/Announcements'
import { Calendar } from '../Calendar/Calendar'
import { RouteMapDropzone } from '../Map/RouteMapDropzone/RouteMapDropzone'
import { PdfDropzone } from '../PdfViewer/PdfDropzone'
import {
  AnnouncementsContainer,
  CalendarContainer,
  MapContainer,
  PageContent,
  PageRoot,
  PanelBody,
  PanelHeader,
  PdfContainer,
  RightColumn,
} from './HomePage.styles'

export const HomePage = () => {
  return (
    <PageRoot>
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
