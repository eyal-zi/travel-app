// Shared file-type options for the large-file search and the new-file request.
// Mirrors the server's LARGE_FILE_TYPES.

import type { SelectOption } from '../types'

// The five fixed file-type choices.
export const LARGE_FILE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'geojson', label: 'GeoJSON' },
  { value: 'shapefile', label: 'Shapefile' },
  { value: 'kml', label: 'KML' },
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
]

// Sentinel option that reveals a free-text input; its typed values are sent
// alongside the fixed selections.
export const OTHER_FILE_TYPE = 'other'
