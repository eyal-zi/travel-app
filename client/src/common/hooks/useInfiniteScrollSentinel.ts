import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

// How far before the sentinel enters the viewport to start fetching the next page.
const ROOT_MARGIN = '200px'

type InfiniteScrollArgs = {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

/**
 * Wires a bottom sentinel to a cursor-paginated query: fetches the next (older)
 * page as soon as the sentinel nears the viewport. Attach the returned ref to a
 * zero-height element rendered after the list. Shared by every infinite feed.
 */
export const useInfiniteScrollSentinel = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteScrollArgs) => {
  const { ref: sentinelRef, inView } = useInView({ rootMargin: ROOT_MARGIN })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return { sentinelRef }
}
