import type { Accept } from 'react-dropzone'
import type { FeatureCollection } from 'geojson'
import { parseKml } from './kml'

/** Turns one supported source format into the common GeoJSON format. */
interface GeoFormat {
  /** Parse a file of this format into a `FeatureCollection`. */
  parse: (file: File) => Promise<FeatureCollection>
  /** Dropzone `accept` entry: MIME type → matching file extensions. */
  accept: Accept
}

/**
 * The single source of truth for which file formats the app understands, keyed
 * by lowercased file extension. Adding a new format (GPX, GeoJSON, …) means
 * adding one entry here — both parsing ({@link parseFile}) and the drop-zone
 * filter ({@link acceptedFileTypes}) pick it up automatically.
 */
const FORMATS: Record<string, GeoFormat> = {
  kml: {
    parse: parseKml,
    accept: { 'application/vnd.google-earth.kml+xml': ['.kml'] },
  },
}

const extensionOf = (filename: string) => filename.split('.').pop()?.toLowerCase() ?? ''

/**
 * Parse any supported file into a GeoJSON `FeatureCollection`, choosing the
 * parser by file extension. Throws a clear error for unsupported types.
 */
export const parseFile = (file: File): Promise<FeatureCollection> => {
  const format = FORMATS[extensionOf(file.name)]
  if (!format) {
    throw new Error(`Unsupported file type: "${file.name}".`)
  }
  return format.parse(file)
}

/**
 * Merged `accept` map for every supported format, ready to hand to
 * `useDropzone` so the drop-zone only accepts files we can actually parse.
 */
export const acceptedFileTypes: Accept = Object.values(FORMATS).reduce<Accept>(
  (merged, { accept }) => ({ ...merged, ...accept }),
  {},
)
