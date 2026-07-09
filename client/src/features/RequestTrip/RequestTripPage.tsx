import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTabParam } from '../../common/hooks/useTabParam'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { TripRequestForm } from './components/TripRequestForm/TripRequestForm'
import { TripRequestsList } from './components/TripRequestsList/TripRequestsList'
import { HeaderText, PageHeader, PageRoot, Shell } from './RequestTrip.styles'

type TabValue = 'form' | 'list'

export const RequestTripPage = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useTabParam(['form', 'list'] as const, 'form')
  const [, setSearchParams] = useSearchParams()

  return (
    <PageRoot>
      <Shell>
        <PageHeader>
          <HeaderText>
            <Typography variant="h5">Trip requests</Typography>
            <Typography variant="body2" color="text.secondary">
              Submit a new request or browse the ones you've made.
            </Typography>
          </HeaderText>
        </PageHeader>

        <Tabs value={tab} onChange={(_event, value: TabValue) => setTab(value)}>
          <Tab value="form" label="New request" />
          <Tab value="list" label="My requests" />
        </Tabs>

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
