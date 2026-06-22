import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded'
import type { Announcement } from '../../Announcements.types'
import { AnnouncementItem } from '../AnnouncementItem/AnnouncementItem'
import { Header, List, Sentinel, StatusRow } from '../../Announcements.styles'

type AnnouncementsListProps = {
  items: Announcement[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

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
  // Fetch the next (older) page when the bottom sentinel nears the viewport.
  const { ref: sentinelRef, inView } = useInView({ rootMargin: '200px' })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

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

        {isLoading && (
          <StatusRow>
            <CircularProgress size={22} />
          </StatusRow>
        )}

        {isError && !isLoading && (
          <StatusRow sx={{ flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">Failed to load announcements.</Typography>
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          </StatusRow>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <StatusRow>
            <Typography variant="body2">No announcements yet.</Typography>
          </StatusRow>
        )}

        {isFetchingNextPage && (
          <StatusRow>
            <CircularProgress size={20} />
          </StatusRow>
        )}

        {hasNextPage && <Sentinel ref={sentinelRef} />}
      </List>
    </>
  )
}
