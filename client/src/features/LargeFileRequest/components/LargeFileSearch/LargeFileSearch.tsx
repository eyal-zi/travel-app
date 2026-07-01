import { useState } from 'react'
import { LargeFileRequestForm } from '../LargeFileRequestForm/LargeFileRequestForm'
import { LargeFileResultsList } from '../LargeFileResultsList/LargeFileResultsList'
import type { AppliedFilters } from '../../queries/useLargeFileSearch'
import { ResultsColumn, Split } from '../../LargeFileRequest.styles'

/**
 * The "Search files" experience: the filters/map form on the left and the
 * matching results on the right. Owns the applied-filter state (null until the
 * first search) so it can be dropped into any page that needs file search.
 */
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
