import type { Accept } from 'react-dropzone'
import type { FeatureCollection } from 'geojson'
import { parseKml } from './kml'
import { parseShpFile } from './shp'
import { parseCsv } from './csv'
import { parseExcel } from './excel'
import { parseGeoJson } from './geojson'

interface GeoFormat {
  parse: (file: File) => Promise<FeatureCollection>
  accept: Accept
}

const FORMATS: Record<string, GeoFormat> = {
  kml: {
    parse: parseKml,
    accept: { 'application/vnd.google-earth.kml+xml': ['.kml'] },
  },
  // .shp has no reliable MIME type; react-dropzone matches on the listed extension.
  shp: {
    parse: parseShpFile,
    accept: { 'application/octet-stream': ['.shp'] },
  },
  geojson: {
    parse: parseGeoJson,
    accept: { 'application/geo+json': ['.geojson'], 'application/json': ['.json'] },
  },
  // parseFile dispatches by extension, so .json needs its own entry. Its accept map
  // is already covered by the geojson entry above, so leave it empty to avoid duplicates.
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
  // parseFile dispatches by extension, so each Excel extension needs its own entry. The
  // accept map is already covered by the xlsx entry above, so leave these empty to avoid
  // duplicates.
  xls: {
    parse: parseExcel,
    accept: {},
  },
  xlsm: {
    parse: parseExcel,
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
