import { Calendar } from '../Calendar/Calendar'
import { MapDropzone } from '../Map/MapDropzone/MapDropzone'
import { ColorModeToggle } from '../../theme/ColorModeToggle'
import {
  CalendarContainer,
  MapContainer,
  PageContent,
  PageHeader,
  PageRoot,
} from './HomePage.styles'

export const HomePage = () => {
  return (
    <PageRoot>
      <PageHeader>
        <ColorModeToggle />
      </PageHeader>
      <PageContent>
        <CalendarContainer>
          <Calendar />
        </CalendarContainer>
        <MapContainer>
          <MapDropzone />
        </MapContainer>
      </PageContent>
    </PageRoot>
  )
}
