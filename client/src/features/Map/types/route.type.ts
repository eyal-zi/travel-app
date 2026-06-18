import type { FeatureCollection } from 'geojson'

/**
 * A route record as returned by the server. Mirrors the `routes` table; the
 * geometry travels as a GeoJSON FeatureCollection (`data`).
 */
export interface Route {
  id: string
  name: string
  /** The calendar date the route belongs to ("YYYY-MM-DD"). Unique per route. */
  date: string
  data: FeatureCollection
  createdAt: string
  updatedAt: string
}

/** The writable fields of a route, sent as a JSON body on create/update. */
export interface RouteInput {
  name: string
  /**
   * The calendar date ("YYYY-MM-DD") the route belongs to. Creating with a date
   * that already exists overwrites that date's route rather than duplicating it.
   */
  date: string
  data: FeatureCollection
}
