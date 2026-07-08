import { useInfiniteQuery } from '@tanstack/react-query'
import { largeFileService } from '../services/largeFileService'
import type { LargeFileSearch } from '../types'

const PAGE_SIZE = 20

export const largeFilesKey = ['large-files'] as const



export type AppliedFilters = Omit<LargeFileSearch, 'cursor' | 'limit'>






export const useLargeFileSearch = (filters: AppliedFilters | null) => {
  const query = useInfiniteQuery({
    
    
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
