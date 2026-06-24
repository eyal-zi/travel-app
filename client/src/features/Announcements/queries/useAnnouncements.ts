import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import type { Announcement, AnnouncementPage } from '../Announcements.types'
import { announcementService } from '../services/announcementService'

const PAGE_SIZE = 20
const announcementsKey = ['announcements'] as const

type AnnouncementsData = InfiniteData<AnnouncementPage, string | undefined>

/**
 * Owns the announcements feed: a newest-first, cursor-paginated infinite query
 * plus a create mutation that prepends the new announcement to the top.
 */
export const useAnnouncements = () => {
  const queryClient = useQueryClient()

  const query = useInfiniteQuery({
    queryKey: announcementsKey,
    queryFn: async ({ pageParam }) => {
      const { data } = await announcementService.list({
        cursor: pageParam,
        limit: PAGE_SIZE,
      })
      return data
    },
    initialPageParam: undefined as string | undefined,
    // `nextCursor` is null once there are no older announcements left.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  // Flatten the cursor pages into a single newest-first list for rendering.
  const items = query.data?.pages.flatMap((page) => page.items) ?? []

  const createMutation = useMutation({
    mutationFn: (text: string) =>
      announcementService.create(text).then((res) => res.data),
    onSuccess: (created: Announcement) => {
      // Prepend the new announcement to the first page so it shows immediately
      // without refetching the whole feed.
      queryClient.setQueryData<AnnouncementsData>(announcementsKey, (current) => {
        if (!current) return current
        const [first, ...rest] = current.pages
        const updatedFirst: AnnouncementPage = first
          ? { ...first, items: [created, ...first.items] }
          : { items: [created], nextCursor: null }
        return { ...current, pages: [updatedFirst, ...rest] }
      })
    },
  })

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    add: createMutation.mutate,
    isPosting: createMutation.isPending,
    postError: createMutation.isError,
    resetPostError: createMutation.reset,
  }
}
