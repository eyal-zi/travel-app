import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import { useNavigate } from 'react-router-dom'
import { FileRequestsList } from './components/FileRequestsList/FileRequestsList'
import {
  HeaderText,
  PageHeader,
  PageRoot,
  Shell,
} from './FileRequest.styles'

/**
 * Admin surface for triaging file requests. Reuses the shared FileRequestsList
 * in `admin` mode so reviewers can filter by status, respond, and attach files.
 * Reached from the home "Large file request" box when the signed-in user is an
 * admin; the /admin/* routes are protected by the RequireAdmin guard.
 */
export const FileRequestAdminPage = () => {
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
            <Typography variant="h5">File request admin</Typography>
            <Typography variant="body2" color="text.secondary">
              Review incoming file requests, respond and attach files.
            </Typography>
          </HeaderText>
        </PageHeader>

        <FileRequestsList admin />
      </Shell>
    </PageRoot>
  )
}
