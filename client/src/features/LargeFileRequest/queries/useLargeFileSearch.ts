import { useInfiniteQuery } from '@tanstack/react-query'
import { largeFileService } from '../services/largeFileService'
import type { LargeFileSearch } from '../types'

const PAGE_SIZE = 20

export const largeFilesKey = ['large-files'] as const

// The applied filters (everything except pagination). The page rebuilds this
// only when the user submits, so editing the form doesn't refetch mid-edit.
export type AppliedFilters = Omit<LargeFileSearch, 'cursor' | 'limit'>

/**
 * Runs the large-files search as a newest-first, cursor-paginated infinite
 * query. Stays idle until `filters` is non-null (i.e. the user has searched at
 * least once); changing the applied filters starts a fresh search.
 */
export const useLargeFileSearch = (filters: AppliedFilters | null) => {
  const query = useInfiniteQuery({
    // The filters object is part of the key, so each distinct search is cached
    // and re-running an identical search reuses it.
    queryKey: [...largeFilesKey, filters] as const,
    enabled: filters !== null,
    queryFn: async ({ pageParam }) => {
      const { data } = await largeFileService.search({
        ...filters,
        cursor: pageParam,
        limit: PAGE_SIZE,
      })
      return data
    },
    initialPageParam: undefined as string | undefined,
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
