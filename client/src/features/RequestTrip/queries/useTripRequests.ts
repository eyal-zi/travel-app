import { useInfiniteQuery } from '@tanstack/react-query'
import { tripRequestService } from '../services/tripRequestService'
import type { TripRequestStatus } from '../types'

const PAGE_SIZE = 20

// Shared root key. Create/update mutations invalidate this prefix so every
// status-filtered variant ['trip-requests', <status>] refetches.
export const tripRequestsKey = ['trip-requests'] as const

/**
 * Owns the trip-requests feed: a newest-first, cursor-paginated infinite query,
 * optionally filtered by workflow status. Read-only here; new requests and
 * status changes come in through mutations that invalidate this key so the list
 * refetches.
 */
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
    // `nextCursor` is null once there are no older requests left.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  // Flatten the cursor pages into a single newest-first list for rendering.
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
