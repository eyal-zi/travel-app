import type { LatLngTuple } from 'leaflet'
import type { GeoLayer } from '../../../common/geo/geo.types'

export interface MapProps {
  /** Initial map center as `[lat, lng]`. Defaults to a whole-world view. */
  center?: LatLngTuple
  /** Initial zoom level. Defaults to `2` (the full world fits the viewport). */
  zoom?: number
  /**
   * GeoJSON datasets to draw on the map. Source-agnostic — the map renders
   * whatever it's given (dropped files now, API data later). Defaults to none.
   */
  layers?: GeoLayer[]
}
