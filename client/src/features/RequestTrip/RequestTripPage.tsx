import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

type Tab = 'form' | 'list'

export const RequestTripPage = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('form')

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
            onSubmitted={() => setTab('list')}
            onCancel={() => navigate('/')}
          />
        ) : (
          <TripRequestsList />
        )}
      </Shell>
    </PageRoot>
  )
}
