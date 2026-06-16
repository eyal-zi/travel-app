import { MapContainer, TileLayer } from 'react-leaflet'
import { MapRoot } from './Map.styles'
import type { MapProps } from './Map.types'

/**
 * Clean, parent-filling world map built on react-leaflet. Renders the free
 * OpenStreetMap standard tiles (no API key required) — a foundation to layer
 * markers, routes, and travel data onto later. The wrapper provides the size;
 * pan/zoom interactions are enabled by default.
 */
export const Map = ({ center = [20, 0], zoom = 2 }: MapProps) => {
  return (
    <MapRoot>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom worldCopyJump zoomControl={false}
      >
        {/* OpenStreetMap requires visible attribution per its tile usage policy. */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </MapRoot>
  )
}
