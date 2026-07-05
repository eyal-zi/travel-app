// Shared file-type options for the large-file search and the new-file request.
// Mirrors the server's LARGE_FILE_TYPES.

import type { SelectOption } from '../types'

// The fixed file-type choices. GeoJSON and Shapefile are grouped under a
// "Vector" subheader; the rest render at the top level. The values stay flat, so
// existing label lookups and the request/upload payloads are unchanged.
export const VECTOR_FILE_TYPE_GROUP = 'Vector'

export const LARGE_FILE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'geojson', label: 'GeoJSON', group: VECTOR_FILE_TYPE_GROUP },
  { value: 'shapefile', label: 'Shapefile', group: VECTOR_FILE_TYPE_GROUP },
  { value: 'kml', label: 'KML' },
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
]

// Sentinel option that reveals a free-text input; its typed values are sent
// alongside the fixed selections.
export const OTHER_FILE_TYPE = 'other'
