import L from 'leaflet'
import type { Feature } from 'geojson'
import type { GeoLayer } from './geo.types'







export interface GeoTag {
  id: string
  name: string
  source: GeoLayer['source']
}



type TaggedLayer = L.Layer & {
  _geoTag?: GeoTag
  feature?: Feature
  toGeoJSON: () => Feature
}



const ORPHAN_TAG: GeoTag = { id: '__orphan', name: 'Shapes', source: 'drawn' }


export const tagLayer = (layer: L.Layer, tag: GeoTag) => {
  ;(layer as TaggedLayer)._geoTag = tag
}






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
