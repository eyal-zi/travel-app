import { kml } from '@tmcw/togeojson'
import type { FeatureCollection } from 'geojson'

/**
 * Parse a KML file into a GeoJSON `FeatureCollection`. `@tmcw/togeojson` works
 * on an XML `Document`, so we read the file's text and feed it through the
 * browser-native `DOMParser` (no polyfill needed).
 */
export const parseKml = async (file: File): Promise<FeatureCollection> => {
  const text = await file.text()
  const doc = new DOMParser().parseFromString(text, 'application/xml')

  // `DOMParser` never throws on malformed XML — it returns a document
  // containing a `<parsererror>` node instead. Surface that as a real error.
  if (doc.querySelector('parsererror')) {
    throw new Error(`"${file.name}" is not valid KML/XML.`)
  }

  return kml(doc) as FeatureCollection
}
