


import type { SelectOption } from '../types'






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



export const OTHER_FILE_TYPE = 'other'




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




export const inferFileTypeValue = (extension: string): string =>
  EXTENSION_TO_FILE_TYPE[extension] ?? extension
