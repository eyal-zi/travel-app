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
    
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  
  const items = query.data?.pages.flatMap((page) => page.items) ?? []

  const createMutation = useMutation({
    mutationFn: (text: string) =>
      announcementService.create(text).then((res) => res.data),
    onSuccess: (created: Announcement) => {
      
      
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
