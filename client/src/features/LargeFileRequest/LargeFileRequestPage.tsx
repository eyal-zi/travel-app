import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded'
import { LargeFileRequestForm } from './components/LargeFileRequestForm/LargeFileRequestForm'
import { LargeFileResultsList } from './components/LargeFileResultsList/LargeFileResultsList'
import { FileRequestForm } from '../FileRequest/components/FileRequestForm/FileRequestForm'
import type { AppliedFilters } from './queries/useLargeFileSearch'
import {
  HeaderText,
  PageHeader,
  PageRoot,
  ResultsColumn,
  Shell,
  Split,
} from './LargeFileRequest.styles'

type TabValue = 'search' | 'request'

export const LargeFileRequestPage = () => {
  const navigate = useNavigate()
  // Null until the first search; submitting the form applies a fresh filter set.
  const [filters, setFilters] = useState<AppliedFilters | null>(null)
  const [tab, setTab] = useState<TabValue>('search')

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
        </Tabs>

        {tab === 'search' ? (
          <Split>
            <LargeFileRequestForm onSearch={setFilters} />
            <ResultsColumn>
              <LargeFileResultsList filters={filters} />
            </ResultsColumn>
          </Split>
        ) : (
          <FileRequestForm />
        )}
      </Shell>
    </PageRoot>
  )
}
