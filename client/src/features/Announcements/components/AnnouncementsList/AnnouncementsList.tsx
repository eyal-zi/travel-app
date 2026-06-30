import Typography from '@mui/material/Typography'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import { FeedStatus } from '../../../../common/components/FeedStatus/FeedStatus'
import { useInfiniteScrollSentinel } from '../../../../common/hooks/useInfiniteScrollSentinel'
import { AnnouncementItem } from '../AnnouncementItem/AnnouncementItem'
import { Header, List, Sentinel } from '../../Announcements.styles'
import type { AnnouncementsListProps } from './AnnouncementsList.types'

/**
 * Read-only, newest-first announcements feed (header + cursor-paginated list
 * with infinite scroll). Self-contained so it can be reused on pages that don't
 * allow posting.
 */
export const AnnouncementsList = ({
  items,
  isLoading,
  isError,
  refetch,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: AnnouncementsListProps) => {
  const { sentinelRef } = useInfiniteScrollSentinel({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  return (
    <>
      <Header>
        <CampaignRoundedIcon />
        <Typography variant="h6">Announcements</Typography>
      </Header>

      <List>
        {items.map((announcement) => (
          <AnnouncementItem key={announcement.id} announcement={announcement} />
        ))}

        <FeedStatus
          isLoading={isLoading}
          isError={isError}
          isEmpty={items.length === 0}
          isFetchingNextPage={isFetchingNextPage}
          onRetry={refetch}
          errorMessage="Failed to load announcements."
          emptyMessage="No announcements yet."
        />

        {hasNextPage && <Sentinel ref={sentinelRef} />}
      </List>
    </>
  )
}
