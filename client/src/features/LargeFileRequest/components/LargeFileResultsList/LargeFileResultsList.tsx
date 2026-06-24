import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  useLargeFileSearch,
  type AppliedFilters,
} from '../../queries/useLargeFileSearch'
import { LargeFileResultItem } from '../LargeFileResultItem/LargeFileResultItem'
import { ListPanel, Sentinel, StatusRow } from '../../LargeFileRequest.styles'

type LargeFileResultsListProps = {
  // Null until the user runs their first search; the list stays idle until then.
  filters: AppliedFilters | null
}

/**
 * Newest-first, cursor-paginated results feed with infinite scroll. Owns the
 * search query for the applied filters and loads the next page when the bottom
 * sentinel nears the viewport.
 */
export const LargeFileResultsList = ({ filters }: LargeFileResultsListProps) => {
  const {
    items,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useLargeFileSearch(filters)

  const { ref: sentinelRef, inView } = useInView({ rootMargin: '200px' })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (filters === null) {
    return (
      <ListPanel>
        <StatusRow>
          <SearchRoundedIcon fontSize="large" />
          <Typography variant="body2">
            Set your filters and run a search to see matching files.
          </Typography>
        </StatusRow>
      </ListPanel>
    )
  }

  return (
    <ListPanel>
      {items.map((file) => (
        <LargeFileResultItem key={file.id} file={file} />
      ))}

      {isLoading && (
        <StatusRow>
          <CircularProgress size={24} />
        </StatusRow>
      )}

      {isError && !isLoading && (
        <StatusRow>
          <Typography variant="body2">Search failed.</Typography>
          <Button size="small" onClick={() => refetch()}>
            Retry
          </Button>
        </StatusRow>
      )}

      {!isLoading && !isError && items.length === 0 && (
        <StatusRow>
          <Typography variant="body2">No files match these filters.</Typography>
        </StatusRow>
      )}

      {isFetchingNextPage && (
        <StatusRow>
          <CircularProgress size={20} />
        </StatusRow>
      )}

      {hasNextPage && <Sentinel ref={sentinelRef} />}
    </ListPanel>
  )
}
