export type FeedStatusProps = {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  isFetchingNextPage: boolean
  onRetry: () => void
  
  errorMessage: string
  
  emptyMessage: string
}
