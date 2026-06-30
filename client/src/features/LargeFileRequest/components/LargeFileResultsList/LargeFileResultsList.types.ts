import type { AppliedFilters } from '../../queries/useLargeFileSearch'

export type LargeFileResultsListProps = {
  // Null until the user runs their first search; the list stays idle until then.
  filters: AppliedFilters | null
}
