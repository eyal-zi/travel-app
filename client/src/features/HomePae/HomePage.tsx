import { Calendar } from '../Calendar/Calendar'
import { ColorModeToggle } from '../../theme/ColorModeToggle'
import { CalendarContainer, PageHeader, PageRoot } from './HomePage.styles'

export const HomePage = () => {
  return (
    <PageRoot>
      <PageHeader>
        <ColorModeToggle />
      </PageHeader>
      <CalendarContainer>
        <Calendar />
      </CalendarContainer>
    </PageRoot>
  )
}
