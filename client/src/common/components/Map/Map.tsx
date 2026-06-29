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

// Leaflet's default icon resolves its image URLs through `_getIconUrl`, which prepends an
// auto-detected `imagePath` and breaks the asset URLs the bundler gives us. Dropping that
// override lets the merged URLs below (the marker images shipped with Leaflet) resolve as-is,
// so GeoJSON Point features render with the standard marker instead of appearing iconless.
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const FitBounds = ({ layers }: { layers: GeoLayer[] }) => {
  const map = useMap()
  // Fit on load and when layers are added/removed, but not on every geometry
  // edit — otherwise editing a vertex would keep snapping the viewport.
  const signature = layers.map((layer) => layer.id).join('|')

  useEffect(() => {
    if (!layers.length) return
    const bounds = L.latLngBounds([])
    for (const layer of layers) {
      bounds.extend(L.geoJSON(layer.data).getBounds())
    }
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [24, 24] })
    // `layers` is intentionally excluded; we refit only when the id set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <TileLayer
          url={import.meta.env.VITE_MAP_TILE_URL}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Editable mode renders shapes into a Geoman-managed group instead of
            the read-only GeoJSON layers, so the two never fight over the DOM. */}
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
