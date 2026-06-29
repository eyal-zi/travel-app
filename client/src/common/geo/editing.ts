import L from 'leaflet'
import type { Feature } from 'geojson'
import type { GeoLayer } from './geo.types'

/**
 * Geoman edits Leaflet layers imperatively, so we keep a single FeatureGroup as
 * the working geometry and stamp each Leaflet layer with the identity of the
 * `GeoLayer` it came from. That lets us regroup the flat set of layers back into
 * the original layers when serialising edits out.
 */
export interface GeoTag {
  id: string
  name: string
  source: GeoLayer['source']
}

// geometryToLayer yields Marker/Polyline/Polygon — all carry `toGeoJSON` and a
// `feature` — but the shared base `L.Layer` type doesn't, so widen it here.
type TaggedLayer = L.Layer & {
  _geoTag?: GeoTag
  feature?: Feature
  toGeoJSON: () => Feature
}

// Bucket for any layer that lost its tag (shouldn't happen — drawn shapes are
// tagged on creation — but keeps serialisation total rather than dropping them).
const ORPHAN_TAG: GeoTag = { id: '__orphan', name: 'Shapes', source: 'drawn' }

/** Stamp a Leaflet layer with the GeoLayer it belongs to. */
export const tagLayer = (layer: L.Layer, tag: GeoTag) => {
  ;(layer as TaggedLayer)._geoTag = tag
}

/**
 * Replace the group's contents with one editable Leaflet layer per feature,
 * each tagged with its source GeoLayer. One layer per feature (rather than one
 * per FeatureCollection) so Geoman can edit and remove shapes individually.
 */
export const loadLayersIntoGroup = (
  group: L.FeatureGroup,
  layers: GeoLayer[],
  style?: L.PathOptions,
) => {
  group.clearLayers()
  for (const geoLayer of layers) {
    const tag: GeoTag = { id: geoLayer.id, name: geoLayer.name, source: geoLayer.source }
    for (const feature of geoLayer.data.features) {
      const layer = L.GeoJSON.geometryToLayer(feature, style && { style }) as TaggedLayer
      layer.feature = feature
      layer._geoTag = tag
      group.addLayer(layer)
    }
  }
}

/**
 * Serialise the group back to GeoLayers, regrouping by tag and preserving the
 * order in which source layers first appear.
 */
export const groupToLayers = (group: L.FeatureGroup): GeoLayer[] => {
  const byId = new Map<string, GeoLayer>()
  const order: string[] = []

  group.eachLayer((raw) => {
    const layer = raw as TaggedLayer
    const tag = layer._geoTag ?? ORPHAN_TAG
    const feature = layer.toGeoJSON() as Feature

    const existing = byId.get(tag.id)
    if (existing) {
      existing.data.features.push(feature)
      return
    }
    byId.set(tag.id, {
      id: tag.id,
      name: tag.name,
      source: tag.source,
      data: { type: 'FeatureCollection', features: [feature] },
    })
    order.push(tag.id)
  })

  return order.map((id) => byId.get(id)!)
}
