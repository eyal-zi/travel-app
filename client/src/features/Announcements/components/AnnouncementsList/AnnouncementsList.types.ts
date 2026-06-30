import type { Announcement } from '../../Announcements.types'

export type AnnouncementsListProps = {
  items: Announcement[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}
