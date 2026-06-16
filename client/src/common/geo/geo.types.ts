import type { FeatureCollection } from 'geojson'

export interface GeoLayer {
  id: string
  name: string
  source: 'file' | 'api'
  data: FeatureCollection
}
