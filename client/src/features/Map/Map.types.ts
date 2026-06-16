import type { LatLngTuple } from 'leaflet'

export interface MapProps {
  /** Initial map center as `[lat, lng]`. Defaults to a whole-world view. */
  center?: LatLngTuple
  /** Initial zoom level. Defaults to `2` (the full world fits the viewport). */
  zoom?: number
}
