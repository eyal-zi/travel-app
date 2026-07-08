import type { ReactNode } from 'react'
import type { LatLngTuple } from 'leaflet'
import type { Notification as NotificationData } from '../../hooks/useNotification'
import type { GeoLayer } from '../../geo/geo.types'

export interface MapEditorProps {
  
  layers: GeoLayer[]
  
  onLayersChange: (layers: GeoLayer[]) => void
  
  onAddFiles: (files: File[]) => void | Promise<unknown>
  
  
  notification?: NotificationData | null
  onCloseNotification?: () => void
  
  loading?: boolean
  
  dragPrompt?: string
  
  
  editable?: boolean
  center?: LatLngTuple
  zoom?: number
  
  children?: ReactNode
}
