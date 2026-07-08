import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'


const ROOT_MARGIN = '200px'

type InfiniteScrollArgs = {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}






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
