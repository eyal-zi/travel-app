import type { FeatureCollection } from 'geojson'

/**
 * A route record as returned by the server. Mirrors the `routes` table; the
 * geometry travels as a GeoJSON FeatureCollection (`data`).
 */
export interface Route {
  id: string
  name: string
  data: FeatureCollection
  createdAt: string
  updatedAt: string
}

/** The writable fields of a route, sent as a JSON body on create/update. */
export interface RouteInput {
  name: string
  data: FeatureCollection
}
