import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded'
import { Announcements } from '../Announcements/Announcements'
import { Calendar } from '../Calendar/Calendar'
import { RouteMapDropzone } from '../Map/RouteMapDropzone/RouteMapDropzone'
import { PdfViewer } from '../PdfViewer/PdfViewer'
import { WeatherWidget } from '../Weather/WeatherWidget'
import { ColorModeToggle } from '../../theme/ColorModeToggle'
import {
  AnnouncementsContainer,
  Brand,
  BrandMark,
  CalendarContainer,
  HeaderControls,
  MapContainer,
  PageContent,
  PageHeader,
  PageRoot,
  PdfContainer,
  Sidebar,
} from './HomePage.styles'

export const HomePage = () => {
  return (
    <PageRoot>
      <PageHeader>
        <Brand>
          <BrandMark>
            <ExploreRoundedIcon />
          </BrandMark>
          <Stack spacing={0} sx={{ minWidth: 0 }}>
            <Typography variant="h5" noWrap>
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
          <PdfViewer
            url="https://cs231n.stanford.edu/slides/2021/lecture_1.pdf"
            title="Sample slide deck"
          />
        </PdfContainer>
        <AnnouncementsContainer>
          <Announcements />
        </AnnouncementsContainer>
      </PageContent>
    </PageRoot>
  )
}
