import { kml } from '@tmcw/togeojson'
import type { FeatureCollection } from 'geojson'

export const parseKml = async (file: File): Promise<FeatureCollection> => {
  const text = await file.text()
  const doc = new DOMParser().parseFromString(text, 'application/xml')

  if (doc.querySelector('parsererror')) {
    throw new Error(`"${file.name}" is not valid KML/XML.`)
  }

  return kml(doc) as FeatureCollection
}
