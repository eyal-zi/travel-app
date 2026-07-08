import type { Accept } from 'react-dropzone'
import type { FeatureCollection } from 'geojson'
import { parseKml } from './kml'
import { parseShpFile } from './shp'
import { parseCsv } from './csv'
import { parseExcel } from './excel'
import { parseGeoJson } from './geojson'
import { parseGeoTiff } from './geotiff'

interface GeoFormat {
  parse: (file: File) => Promise<FeatureCollection>
  accept: Accept
}

const FORMATS: Record<string, GeoFormat> = {
  kml: {
    parse: parseKml,
    accept: { 'application/vnd.google-earth.kml+xml': ['.kml'] },
  },
  
  shp: {
    parse: parseShpFile,
    accept: { 'application/octet-stream': ['.shp'] },
  },
  geojson: {
    parse: parseGeoJson,
    accept: { 'application/geo+json': ['.geojson'], 'application/json': ['.json'] },
  },
  
  
  json: {
    parse: parseGeoJson,
    accept: {},
  },
  csv: {
    parse: parseCsv,
    accept: { 'text/csv': ['.csv'] },
  },
  xlsx: {
    parse: parseExcel,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm'],
    },
  },
  
  
  
  xls: {
    parse: parseExcel,
    accept: {},
  },
  xlsm: {
    parse: parseExcel,
    accept: {},
  },
  
  tiff: {
    parse: parseGeoTiff,
    accept: { 'image/tiff': ['.tif', '.tiff'] },
  },
  
  
  tif: {
    parse: parseGeoTiff,
    accept: {},
  },
}

const extensionOf = (filename: string) => filename.split('.').pop()?.toLowerCase() ?? ''

export const parseFile = (file: File): Promise<FeatureCollection> => {
  const format = FORMATS[extensionOf(file.name)]
  if (!format) {
    throw new Error(`Unsupported file type: "${file.name}".`)
  }
  return format.parse(file)
}

export const acceptedFileTypes: Accept = Object.values(FORMATS).reduce<Accept>(
  (merged, { accept }) => ({ ...merged, ...accept }),
  {},
)




export const isParseable = (file: File): boolean =>
  extensionOf(file.name) in FORMATS
