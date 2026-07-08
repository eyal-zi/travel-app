import { useEffect } from 'react'
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import type { MapProps } from './Map.types'
import type { GeoLayer } from '../../geo/geo.types'
import { MapRoot } from './Map.styles'
import { DrawController } from './draw/DrawController'
import { MapDrawToolbar } from './draw/MapDrawToolbar'





delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})




const HideAttribution = () => {
  const map = useMap()
  useEffect(() => {
    map.attributionControl?.setPrefix(false)
  }, [map])
  return null
}

const FitBounds = ({ layers }: { layers: GeoLayer[] }) => {
  const map = useMap()
  
  
  const signature = layers.map((layer) => layer.id).join('|')

  useEffect(() => {
    if (!layers.length) return
    const bounds = L.latLngBounds([])
    for (const layer of layers) {
      bounds.extend(L.geoJSON(layer.data).getBounds())
    }
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] })
    
    
  }, [signature, map])

  return null
}

export const Map = ({
  center = [20, 0],
  zoom = 2,
  layers = [],
  editable = false,
  onLayersChange,
}: MapProps) => {
  return (
    <MapRoot>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom worldCopyJump zoomControl={false}
      >
        <HideAttribution />
        <TileLayer url={import.meta.env.VITE_MAP_TILE_URL} />
        {
}
        {editable ? (
          <>
            <DrawController layers={layers} onChange={onLayersChange} />
            <MapDrawToolbar />
          </>
        ) : (
          layers.map((layer) => <GeoJSON key={layer.id} data={layer.data} />)
        )}
        <FitBounds layers={layers} />
      </MapContainer>
    </MapRoot>
  )
}
