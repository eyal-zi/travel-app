import type { FeatureCollection } from 'geojson'

/**
 * A single geo dataset ready to be drawn on the map, normalized to GeoJSON —
 * the common interchange format every source (dropped files, the API later)
 * converts to. The map renders {@link GeoLayer}s without caring where they came
 * from, so new formats/sources slot in without touching rendering.
 */
export interface GeoLayer {
  /** Stable identity for React keys and removal. */
  id: string
  /** Human label — the source filename now, an API resource name later. */
  name: string
  /** Where the layer came from. Only `'file'` is produced today. */
  source: 'file' | 'api'
  /** The geometry to draw, as a GeoJSON `FeatureCollection`. */
  data: FeatureCollection
}
