import type { LatLngTuple } from 'leaflet'
import type { GeoLayer } from '../../geo/geo.types'

export interface MapProps {
  center?: LatLngTuple
  zoom?: number
  layers?: GeoLayer[]
  
  
  editable?: boolean
  onLayersChange?: (layers: GeoLayer[]) => void
}
