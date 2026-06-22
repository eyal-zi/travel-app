import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import { useNavigate } from 'react-router-dom'
import { TripRequestsList } from '../RequestTrip/components/TripRequestsList/TripRequestsList'
import {
  HeaderText,
  PageHeader,
  PageRoot,
  Shell,
} from '../RequestTrip/RequestTrip.styles'

/**
 * Admin surface for triaging trip requests. Reuses the shared
 * TripRequestsList in `admin` mode so reviewers can filter by status and move
 * requests through the workflow. Intentionally unlinked — reachable only by
 * navigating to /admin directly.
 */
export const AdminPage = () => {
  const navigate = useNavigate()

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
          <AdminPanelSettingsRoundedIcon color="primary" />
          <HeaderText>
            <Typography variant="h5">Trip request admin</Typography>
            <Typography variant="body2" color="text.secondary">
              Review incoming requests and update their status.
            </Typography>
          </HeaderText>
        </PageHeader>

        <TripRequestsList admin />
      </Shell>
    </PageRoot>
  )
}
