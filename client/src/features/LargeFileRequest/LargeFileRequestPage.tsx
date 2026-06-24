import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded'
import { LargeFileRequestForm } from './components/LargeFileRequestForm/LargeFileRequestForm'
import { LargeFileResultsList } from './components/LargeFileResultsList/LargeFileResultsList'
import type { AppliedFilters } from './queries/useLargeFileSearch'
import {
  HeaderText,
  PageHeader,
  PageRoot,
  ResultsColumn,
  Shell,
  Split,
} from './LargeFileRequest.styles'

export const LargeFileRequestPage = () => {
  const navigate = useNavigate()
  // Null until the first search; submitting the form applies a fresh filter set.
  const [filters, setFilters] = useState<AppliedFilters | null>(null)

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
              Filter by file type, accuracy and map area to find matching files.
            </Typography>
          </HeaderText>
        </PageHeader>

        <Split>
          <LargeFileRequestForm onSearch={setFilters} />
          <ResultsColumn>
            <LargeFileResultsList filters={filters} />
          </ResultsColumn>
        </Split>
      </Shell>
    </PageRoot>
  )
}
