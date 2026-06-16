import { useEffect } from 'react'
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { MapProps } from './Map.types'
import type { GeoLayer } from '../../../common/geo/geo.types'
import { MapRoot } from './Map.styles'

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const FitBounds = ({ layers }: { layers: GeoLayer[] }) => {
  const map = useMap()

  useEffect(() => {
    if (!layers.length) return
    const bounds = L.latLngBounds([])
    for (const layer of layers) {
      bounds.extend(L.geoJSON(layer.data).getBounds())
    }
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] })
  }, [layers, map])

  return null
}

export const Map = ({ center = [20, 0], zoom = 2, layers = [] }: MapProps) => {
  return (
    <MapRoot>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom worldCopyJump zoomControl={false}
      >
        <TileLayer
          url={import.meta.env.VITE_MAP_TILE_URL}
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
