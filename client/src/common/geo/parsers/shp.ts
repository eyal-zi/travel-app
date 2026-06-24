import { parseShp } from 'shpjs'
import type { FeatureCollection, Geometry } from 'geojson'

// Parses a raw .shp file (geometry only — no .dbf attributes or .prj projection).
// Coordinates are assumed to already be in WGS84 (lng/lat).
export const parseShpFile = async (file: File): Promise<FeatureCollection> => {
  const buffer = await file.arrayBuffer()
  const geometries = parseShp(buffer) as Geometry[]
  if (!geometries.length) throw new Error(`"${file.name}" contains no geometry.`)

  return {
    type: 'FeatureCollection',
    features: geometries.map((geometry) => ({ type: 'Feature', geometry, properties: {} })),
  }
}
