import type { ReactNode } from 'react'
import type { LatLngTuple } from 'leaflet'
import type { Notification as NotificationData } from '../../hooks/useNotification'
import type { GeoLayer } from '../../geo/geo.types'

export interface MapEditorProps {
  // The layers to display/edit. The caller owns this state.
  layers: GeoLayer[]
  // Toolbar draw/edit/delete edits report the full new layer set here.
  onLayersChange: (layers: GeoLayer[]) => void
  // Dropped geo files (KML/SHP/CSV/Excel) are handed off here for parsing.
  onAddFiles: (files: File[]) => void | Promise<unknown>
  // Transient notification surfaced over the map (parse/save/load feedback),
  // owned by the caller via `useNotification`.
  notification?: NotificationData | null
  onCloseNotification?: () => void
  // Shows a "Loading map…" overlay while the caller fetches the baseline.
  loading?: boolean
  // Overlay text shown while dragging a file over the map.
  dragPrompt?: string
  center?: LatLngTuple
  zoom?: number
  // Overlays rendered on top of the map (Save/Cancel bar, clear chip, layer list…).
  children?: ReactNode
}
