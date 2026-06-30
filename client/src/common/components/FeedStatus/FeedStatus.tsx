import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import type { FeedStatusProps } from './FeedStatus.types'
import { StatusRow } from './FeedStatus.styles'

/**
 * The loading / error / empty / loading-more rows shared by every infinite feed.
 * Renders the single state that applies (or nothing once items are present and
 * no page is in flight), so a list can drop it in between its items and its
 * scroll sentinel.
 */
export const FeedStatus = ({
  isLoading,
  isError,
  isEmpty,
  isFetchingNextPage,
  onRetry,
  errorMessage,
  emptyMessage,
}: FeedStatusProps) => (
  <>
    {isLoading && (
      <StatusRow>
        <CircularProgress size={24} />
      </StatusRow>
    )}

    {isError && !isLoading && (
      <StatusRow>
        <Typography variant="body2">{errorMessage}</Typography>
        <Button size="small" onClick={onRetry}>
          Retry
        </Button>
      </StatusRow>
    )}

    {!isLoading && !isError && isEmpty && (
      <StatusRow>
        <Typography variant="body2">{emptyMessage}</Typography>
      </StatusRow>
    )}

    {isFetchingNextPage && (
      <StatusRow>
        <CircularProgress size={20} />
      </StatusRow>
    )}
  </>
)
