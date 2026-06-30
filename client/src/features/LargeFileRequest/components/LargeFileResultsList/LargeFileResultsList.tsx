import Typography from '@mui/material/Typography'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { FeedStatus } from '../../../../common/components/FeedStatus/FeedStatus'
import { useInfiniteScrollSentinel } from '../../../../common/hooks/useInfiniteScrollSentinel'
import { useLargeFileSearch } from '../../queries/useLargeFileSearch'
import { LargeFileResultItem } from '../LargeFileResultItem/LargeFileResultItem'
import { ListPanel, Sentinel, StatusRow } from '../../LargeFileRequest.styles'
import type { LargeFileResultsListProps } from './LargeFileResultsList.types'

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

  const { sentinelRef } = useInfiniteScrollSentinel({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

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

      <FeedStatus
        isLoading={isLoading}
        isError={isError}
        isEmpty={items.length === 0}
        isFetchingNextPage={isFetchingNextPage}
        onRetry={refetch}
        errorMessage="Search failed."
        emptyMessage="No files match these filters."
      />

      {hasNextPage && <Sentinel ref={sentinelRef} />}
    </ListPanel>
  )
}
