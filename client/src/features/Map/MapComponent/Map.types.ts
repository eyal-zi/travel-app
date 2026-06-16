import type { LatLngTuple } from 'leaflet'
import type { GeoLayer } from '../../../common/geo/geo.types'

export interface MapProps {
  center?: LatLngTuple
  zoom?: number
  layers?: GeoLayer[]
}
