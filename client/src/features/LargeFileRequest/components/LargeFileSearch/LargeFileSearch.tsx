import { useState } from 'react'
import { LargeFileRequestForm } from '../LargeFileRequestForm/LargeFileRequestForm'
import { LargeFileResultsList } from '../LargeFileResultsList/LargeFileResultsList'
import type { AppliedFilters } from '../../queries/useLargeFileSearch'
import { ResultsColumn, Split } from '../../LargeFileRequest.styles'






export const LargeFileSearch = () => {
  const [filters, setFilters] = useState<AppliedFilters | null>(null)

  return (
    <Split>
      <LargeFileRequestForm onSearch={setFilters} />
      <ResultsColumn>
        <LargeFileResultsList filters={filters} />
      </ResultsColumn>
    </Split>
  )
}
