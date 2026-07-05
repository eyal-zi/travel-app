import { useDropzone } from 'react-dropzone'
import { Map } from '../Map/Map'
import { Notification } from '../Notification/Notification'
import { acceptedFileTypes } from '../../geo/parsers'
import { DragOverlay, DropzoneRoot } from './MapEditor.styles'
import type { MapEditorProps } from './MapEditor.types'

const DEFAULT_PROMPT = 'Drop a KML, GeoJSON, SHP, CSV or Excel file to add it to the map'
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
  editable = true,
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
    disabled: !editable,
  })

  return (
    <DropzoneRoot {...getRootProps()}>
      <input {...getInputProps()} />
      <Map center={center} zoom={zoom} layers={layers} editable={editable} onLayersChange={onLayersChange} />

      {isDragActive && <DragOverlay>{dragPrompt}</DragOverlay>}
      {loading && <DragOverlay>Loading map…</DragOverlay>}

      {children}

      <Notification notification={notification} onClose={onCloseNotification} />
    </DropzoneRoot>
  )
}
