import { useInfiniteQuery } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import type { FileRequestStatus } from '../types'

const PAGE_SIZE = 20



export const fileRequestsKey = ['file-requests'] as const







export const useFileRequests = (status?: FileRequestStatus) => {
  const query = useInfiniteQuery({
    queryKey: [...fileRequestsKey, status ?? 'all'],
    queryFn: async ({ pageParam }) => {
      const { data } = await fileRequestService.list({
        cursor: pageParam,
        limit: PAGE_SIZE,
        status,
      })
      return data
    },
    initialPageParam: undefined as string | undefined,
    
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  
  const items = query.data?.pages.flatMap((page) => page.items) ?? []

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
  }
}
