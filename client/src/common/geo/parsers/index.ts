import type { Accept } from 'react-dropzone'
import type { FeatureCollection } from 'geojson'
import { parseKml } from './kml'

interface GeoFormat {
  parse: (file: File) => Promise<FeatureCollection>
  accept: Accept
}

const FORMATS: Record<string, GeoFormat> = {
  kml: {
    parse: parseKml,
    accept: { 'application/vnd.google-earth.kml+xml': ['.kml'] },
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
