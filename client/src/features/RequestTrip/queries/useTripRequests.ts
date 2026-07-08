import { useInfiniteQuery } from '@tanstack/react-query'
import { tripRequestService } from '../services/tripRequestService'
import type { TripRequestStatus } from '../types'

const PAGE_SIZE = 20



export const tripRequestsKey = ['trip-requests'] as const







export const useTripRequests = (status?: TripRequestStatus) => {
  const query = useInfiniteQuery({
    queryKey: [...tripRequestsKey, status ?? 'all'],
    queryFn: async ({ pageParam }) => {
      const { data } = await tripRequestService.list({
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
