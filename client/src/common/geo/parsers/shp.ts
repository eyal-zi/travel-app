import { parseShp } from 'shpjs'
import type { FeatureCollection, Geometry } from 'geojson'



export const parseShpFile = async (file: File): Promise<FeatureCollection> => {
  const buffer = await file.arrayBuffer()
  const geometries = parseShp(buffer) as Geometry[]
  if (!geometries.length) throw new Error(`"${file.name}" contains no geometry.`)

  return {
    type: 'FeatureCollection',
    features: geometries.map((geometry) => ({ type: 'Feature', geometry, properties: {} })),
  }
}
