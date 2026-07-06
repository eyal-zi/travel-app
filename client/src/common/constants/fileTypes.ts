// Shared file-type options for the large-file search and the new-file request.
// Mirrors the server's LARGE_FILE_TYPES.

import type { SelectOption } from '../types'

// The fixed file-type choices. GeoJSON and Shapefile are grouped under a
// "Vector" subheader, TIFF and ECW under an "Orthophoto" subheader, OSGB under
// a "Photorealistic" subheader; the rest render at the top level. The values
// stay flat, so existing label lookups and the request/upload payloads are
// unchanged.
export const VECTOR_FILE_TYPE_GROUP = 'Vector'
export const ORTHOPHOTO_FILE_TYPE_GROUP = 'Orthophoto'
export const PHOTOREALISTIC_FILE_TYPE_GROUP = 'Photorealistic'

export const LARGE_FILE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'geojson', label: 'GeoJSON', group: VECTOR_FILE_TYPE_GROUP },
  { value: 'shapefile', label: 'Shapefile', group: VECTOR_FILE_TYPE_GROUP },
  { value: 'tiff', label: 'TIFF', group: ORTHOPHOTO_FILE_TYPE_GROUP },
  { value: 'ecw', label: 'ECW', group: ORTHOPHOTO_FILE_TYPE_GROUP },
  { value: 'osgb', label: 'OSGB', group: PHOTOREALISTIC_FILE_TYPE_GROUP },
  { value: 'kml', label: 'KML' },
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
]

// Sentinel option that reveals a free-text input; its typed values are sent
// alongside the fixed selections.
export const OTHER_FILE_TYPE = 'other'

// Maps common file extensions to the fixed large-file type values. Extensions
// not listed here fall back to the "Other…" option, carrying the raw extension
// as its custom label.
const EXTENSION_TO_FILE_TYPE: Record<string, string> = {
  geojson: 'geojson',
  json: 'geojson',
  shp: 'shapefile',
  tiff: 'tiff',
  tif: 'tiff',
  ecw: 'ecw',
  osgb: 'osgb',
  kml: 'kml',
  csv: 'csv',
  xls: 'excel',
  xlsx: 'excel',
}

// Splits a file name into its base (without extension) and lower-cased
// extension. Leading-dot files ("no name") and names without a dot yield an
// empty extension.
export const splitFileName = (
  fileName: string,
): { base: string; extension: string } => {
  const dot = fileName.lastIndexOf('.')
  if (dot <= 0) return { base: fileName, extension: '' }
  return {
    base: fileName.slice(0, dot),
    extension: fileName.slice(dot + 1).toLowerCase(),
  }
}

// Resolves a file extension to a file-type value. Known extensions map to a
// fixed option; anything else falls back to the raw extension as a custom value
// (the autocomplete accepts arbitrary typed values via freeSolo).
export const inferFileTypeValue = (extension: string): string =>
  EXTENSION_TO_FILE_TYPE[extension] ?? extension
