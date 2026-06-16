import { useEffect } from 'react'
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { MapProps } from './Map.types'
import type { GeoLayer } from '../../../common/geo/geo.types'
import { MapRoot } from './Map.styles'

// Leaflet's default marker icon resolves its image URLs relative to the CSS,
// which breaks under bundlers (the images 404). Point at the bundled assets so
// KML point placemarks render with the standard pin instead of a broken image.
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

/**
 * Pans/zooms the map to fit the given layers whenever they change, so a newly
 * added dataset is immediately in view. Rendered as a child of `MapContainer`
 * so it can reach the map instance via `useMap`. Renders nothing.
 */
const FitBounds = ({ layers }: { layers: GeoLayer[] }) => {
  const map = useMap()

  useEffect(() => {
    if (!layers.length) return
    // Combine every layer's extent into one bounds, then fit to it.
    const bounds = L.latLngBounds([])
    for (const layer of layers) {
      bounds.extend(L.geoJSON(layer.data).getBounds())
    }
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] })
  }, [layers, map])

  return null
}

/**
 * Clean, parent-filling world map built on react-leaflet. Renders the free
 * OpenStreetMap standard tiles (no API key required) and draws any GeoJSON
 * `layers` it's handed. Purely presentational — it doesn't know or care where
 * the layers came from (dropped files now, API data later). The wrapper
 * provides the size; pan/zoom interactions are enabled by default.
 */
export const Map = ({ center = [20, 0], zoom = 2, layers = [] }: MapProps) => {
  return (
    <MapRoot>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom worldCopyJump zoomControl={false}
      >
        {/* OpenStreetMap requires visible attribution per its tile usage policy. */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {layers.map((layer) => (
          <GeoJSON key={layer.id} data={layer.data} />
        ))}
        <FitBounds layers={layers} />
      </MapContainer>
    </MapRoot>
  )
}
