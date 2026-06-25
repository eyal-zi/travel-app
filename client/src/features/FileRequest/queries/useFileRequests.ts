import { useInfiniteQuery } from '@tanstack/react-query'
import { fileRequestService } from '../services/fileRequestService'
import type { FileRequestStatus } from '../types'

const PAGE_SIZE = 20

// Shared root key. Create/update mutations invalidate this prefix so every
// status-filtered variant ['file-requests', <status>] refetches.
export const fileRequestsKey = ['file-requests'] as const

/**
 * Owns the file-requests feed: a newest-first, cursor-paginated infinite query,
 * optionally filtered by workflow status. Read-only here; new requests and
 * status changes come in through mutations that invalidate this key so the list
 * refetches.
 */
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
