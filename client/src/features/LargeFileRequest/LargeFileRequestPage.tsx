import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTabParam } from '../../common/hooks/useTabParam'
import { useNotification } from '../../common/hooks/useNotification'
import { Notification } from '../../common/components/Notification/Notification'
import IconButton from '@mui/material/IconButton'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded'
import { LargeFileSearch } from './components/LargeFileSearch/LargeFileSearch'
import { FileRequestForm } from '../FileRequest/components/FileRequestForm/FileRequestForm'
import { FileRequestsList } from '../FileRequest/components/FileRequestsList/FileRequestsList'
import { HeaderText, PageHeader, PageRoot, Shell } from './LargeFileRequest.styles'

type TabValue = 'search' | 'request' | 'history'

export const LargeFileRequestPage = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useTabParam(
    ['search', 'request', 'history'] as const,
    'search',
  )
  const [, setSearchParams] = useSearchParams()
  const { notification, notifySuccess, close } = useNotification()

  // After a request is submitted, take the user to their requests list filtered
  // to the freshly-created "Received" items instead of just clearing the form.
  // Both params go in one update: two separate setters would each start from the
  // committed URL, so the second would clobber the first's change.
  const handleRequestSubmitted = useCallback(() => {
    setSearchParams({ tab: 'history', status: 'received' }, { replace: true })
    notifySuccess('File request submitted!')
  }, [setSearchParams, notifySuccess])

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
          <DatasetRoundedIcon color="primary" />
          <HeaderText>
            <Typography variant="h5">Large file request</Typography>
            <Typography variant="body2" color="text.secondary">
              Search existing files, or request a new one from the admin.
            </Typography>
          </HeaderText>
        </PageHeader>

        <Tabs value={tab} onChange={(_event, value: TabValue) => setTab(value)}>
          <Tab value="search" label="Search files" />
          <Tab value="request" label="Request a file" />
          <Tab value="history" label="My requests" />
        </Tabs>

        {tab === 'search' && <LargeFileSearch />}
        {tab === 'request' && (
          <FileRequestForm onSubmitted={handleRequestSubmitted} />
        )}
        {tab === 'history' && <FileRequestsList />}
      </Shell>

      <Notification notification={notification} onClose={close} />
    </PageRoot>
  )
}
