import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTabParam } from '../../common/hooks/useTabParam'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import { TripRequestForm } from './components/TripRequestForm/TripRequestForm'
import { TripRequestsList } from './components/TripRequestsList/TripRequestsList'
import {
  HeaderText,
  PageHeader,
  PageRoot,
  Shell,
  TabButton,
  TabsBar,
} from './RequestTrip.styles'

export const RequestTripPage = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useTabParam(['form', 'list'] as const, 'form')
  const [, setSearchParams] = useSearchParams()

  return (
    <PageRoot>
      <Shell>
        <PageHeader>
          <IconButton
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back to home"
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <FlightTakeoffRoundedIcon color="primary" />
          <HeaderText>
            <Typography variant="h5">Trip requests</Typography>
            <Typography variant="body2" color="text.secondary">
              Submit a new request or browse the ones you've made.
            </Typography>
          </HeaderText>
        </PageHeader>

        <TabsBar role="tablist">
          <TabButton
            type="button"
            role="tab"
            aria-selected={tab === 'form'}
            active={tab === 'form'}
            onClick={() => setTab('form')}
          >
            <AddRoundedIcon />
            New request
          </TabButton>
          <TabButton
            type="button"
            role="tab"
            aria-selected={tab === 'list'}
            active={tab === 'list'}
            onClick={() => setTab('list')}
          >
            <FormatListBulletedRoundedIcon />
            My requests
          </TabButton>
        </TabsBar>

        {tab === 'form' ? (
          <TripRequestForm
            // Land on the list filtered to the just-submitted (received) request.
            // Both params go in one update: two separate setters would each start
            // from the committed URL, so the second would clobber the first's change.
            onSubmitted={() =>
              setSearchParams(
                { tab: 'list', status: 'received' },
                { replace: true },
              )
            }
            onCancel={() => navigate('/')}
          />
        ) : (
          <TripRequestsList />
        )}
      </Shell>
    </PageRoot>
  )
}
