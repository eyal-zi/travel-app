import { Calendar } from '../Calendar/Calendar'
import { Map } from '../Map/Map'
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
          <Map />
        </MapContainer>
      </PageContent>
    </PageRoot>
  )
}
