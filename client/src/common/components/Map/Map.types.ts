import type { LatLngTuple } from 'leaflet'
import type { GeoLayer } from '../../geo/geo.types'

export interface MapProps {
  center?: LatLngTuple
  zoom?: number
  layers?: GeoLayer[]
  // Enable the draw/edit/delete toolbar. When set, layers become editable and
  // changes are reported through `onLayersChange` instead of being read-only.
  editable?: boolean
  onLayersChange?: (layers: GeoLayer[]) => void
}
