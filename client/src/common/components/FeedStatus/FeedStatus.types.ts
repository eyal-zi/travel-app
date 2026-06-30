export type FeedStatusProps = {
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  isFetchingNextPage: boolean
  onRetry: () => void
  // Shown when the query failed (initial load).
  errorMessage: string
  // Shown when the query succeeded but returned nothing.
  emptyMessage: string
}
