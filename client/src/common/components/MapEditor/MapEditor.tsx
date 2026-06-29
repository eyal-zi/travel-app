import type { ReactNode } from 'react'
import { useDropzone } from 'react-dropzone'
import type { LatLngTuple } from 'leaflet'
import { Map } from '../Map/Map'
import { Notification } from '../Notification/Notification'
import { acceptedFileTypes } from '../../geo/parsers'
import type { Notification as NotificationData } from '../../hooks/useNotification'
import type { GeoLayer } from '../../geo/geo.types'
import { DragOverlay, DropzoneRoot } from './MapEditor.styles'

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

const DEFAULT_PROMPT = 'Drop a KML, SHP, CSV or Excel file to add it to the map'
const noop = () => {}

/**
 * Shared, controlled map editor: file drag-and-drop + the editable Leaflet map
 * (with the draw/edit/delete toolbar) + the shared notification snackbar. It
 * owns no layer state and no persistence — callers pass `layers`, react to
 * `onLayersChange` (toolbar edits) and `onAddFiles` (drops), and supply any
 * overlays via `children`. This is the single place the dropzone + map wiring
 * lives, so `MapDropzone`/`GeoFilterMap` no longer duplicate it.
 */
export const MapEditor = ({
  layers,
  onLayersChange,
  onAddFiles,
  notification = null,
  onCloseNotification = noop,
  loading = false,
  dragPrompt = DEFAULT_PROMPT,
  center,
  zoom,
  children,
}: MapEditorProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (accepted: File[]) => {
      if (accepted.length) await onAddFiles(accepted)
    },
    accept: acceptedFileTypes,
    noClick: true,
    noKeyboard: true,
  })

  return (
    <DropzoneRoot {...getRootProps()}>
      <input {...getInputProps()} />
      <Map center={center} zoom={zoom} layers={layers} editable onLayersChange={onLayersChange} />

      {isDragActive && <DragOverlay>{dragPrompt}</DragOverlay>}
      {loading && <DragOverlay>Loading map…</DragOverlay>}

      {children}

      <Notification notification={notification} onClose={onCloseNotification} />
    </DropzoneRoot>
  )
}
