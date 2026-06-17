import { Calendar } from '../Calendar/Calendar'
import { MapDropzone } from '../Map/MapDropzone/MapDropzone'
import { PdfViewer } from '../PdfViewer/PdfViewer'
import { ColorModeToggle } from '../../theme/ColorModeToggle'
import {
  CalendarContainer,
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
        <ColorModeToggle />
      </PageHeader>
      <PageContent>
        <Sidebar>
          <CalendarContainer>
            <Calendar />
          </CalendarContainer>
          <MapContainer>
            <MapDropzone />
          </MapContainer>
        </Sidebar>
        <PdfContainer>
          <PdfViewer
            url="https://cs231n.stanford.edu/slides/2021/lecture_1.pdf"
            title="Sample slide deck"
          />
        </PdfContainer>
      </PageContent>
    </PageRoot>
  )
}
