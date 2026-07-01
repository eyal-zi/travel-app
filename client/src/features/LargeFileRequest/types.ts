// Large File Request data model — mirrors the server DTO/schema in
// server/src/features/large-files. The search form's fields are all filters;
// the server returns matching records as a cursor-paginated, newest-first page.

import type { FeatureCollection, Geometry } from 'geojson'

// File-type options live in the shared constants so the new-file request form
// can reuse them; re-exported here for existing importers.
export {
  LARGE_FILE_TYPE_OPTIONS,
  OTHER_FILE_TYPE,
} from '../../common/constants/fileTypes'

// Accuracy slider bounds. The server matches records within ±1 of the value.
export const ACCURACY_MIN = 0
export const ACCURACY_MAX = 15

// The search request body. Every field is optional; an empty body returns the
// newest page unfiltered.
export type LargeFileSearch = {
  fileTypes?: string[]
  accuracy?: number
  // Exact country match; omit to match any country.
  country?: string
  // Inclusive coverage-date range, each as 'YYYY-MM-DD'.
  startDate?: string
  endDate?: string
  area?: FeatureCollection
  cursor?: string
  limit?: number
}

// A single search hit: stored metadata plus its footprint as GeoJSON.
export type LargeFileResult = {
  id: string
  name: string
  fileType: string
  accuracy: number
  // Country the file covers, or null when unknown.
  country: string | null
  // Coverage date as 'YYYY-MM-DD', or null when unknown.
  coverageDate: string | null
  sizeBytes: number
  geometry: Geometry
  createdAt: string
}

// A newest-first page of results. `nextCursor` is the createdAt to pass back for
// the next (older) page, or null when there are no older items left.
export type LargeFilePage = {
  items: LargeFileResult[]
  nextCursor: string | null
}
