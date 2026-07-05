import type { Feature, FeatureCollection, GeoJsonObject, Geometry } from 'geojson'

const GEOMETRY_TYPES = new Set([
  'Point',
  'MultiPoint',
  'LineString',
  'MultiLineString',
  'Polygon',
  'MultiPolygon',
  'GeometryCollection',
])

// Normalizes any GeoJSON object (FeatureCollection, single Feature, or a bare
// geometry) into a FeatureCollection so the rest of the map pipeline is uniform.
const toFeatureCollection = (geojson: GeoJsonObject): FeatureCollection => {
  if (geojson.type === 'FeatureCollection') {
    return geojson as FeatureCollection
  }
  if (geojson.type === 'Feature') {
    return { type: 'FeatureCollection', features: [geojson as Feature] }
  }
  if (GEOMETRY_TYPES.has(geojson.type)) {
    return {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', properties: {}, geometry: geojson as Geometry }],
    }
  }
  throw new Error(`Unexpected GeoJSON type: "${geojson.type}".`)
}

export const parseGeoJson = async (file: File): Promise<FeatureCollection> => {
  let parsed: GeoJsonObject
  try {
    parsed = JSON.parse(await file.text()) as GeoJsonObject
  } catch {
    throw new Error(`"${file.name}" is not valid JSON.`)
  }

  if (!parsed || typeof parsed !== 'object' || typeof parsed.type !== 'string') {
    throw new Error(`"${file.name}" is not valid GeoJSON.`)
  }

  return toFeatureCollection(parsed)
}
