import { forwardRef, useEffect, useImperativeHandle } from 'react'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import { MapEditor } from '../MapEditor/MapEditor'
import { useGeoLayers } from '../../geo/useGeoLayers'
import { useNotification } from '../../hooks/useNotification'
import type { GeoLayer } from '../../geo/geo.types'
import { OverlayChip } from './GeoFilterMap.styles'

const DEFAULT_PROMPT = 'Drop a KML, GeoJSON, SHP, CSV or Excel file to set the search area'

type GeoFilterMapProps = {
  // Called whenever the layers change, so the parent can derive the selected
  // area. Memoize it to keep the sync effect stable.
  onChange: (layers: GeoLayer[]) => void
  // Overlay text shown while dragging a file over the map.
  prompt?: string
}

// Imperative handle so a parent can push files onto the map (e.g. reusing a file
// dropped elsewhere in the form). Parse failures surface via this map's own
// notification, so the parent doesn't need to handle them.
export type GeoFilterMapHandle = {
  addFiles: (files: File[]) => void
}

/**
 * Search-area map: drop geo files or draw/edit/delete shapes to define an area.
 * Unlike `RouteMapDropzone` it has no Save/Cancel or persistence — it reports
 * the live layers to the parent form via `onChange`. A thin wrapper over the
 * shared `MapEditor`.
 */
export const GeoFilterMap = forwardRef<GeoFilterMapHandle, GeoFilterMapProps>(
  ({ onChange, prompt = DEFAULT_PROMPT }, ref) => {
    const { notification, notifyError, close } = useNotification()
    const { layers, addFromFiles, clear, replace } = useGeoLayers(notifyError)

    // Let a parent add files through the same parse/notify path as an on-map drop.
    useImperativeHandle(ref, () => ({ addFiles: addFromFiles }), [addFromFiles])

    // Surface the current layers to the parent whenever they change.
    useEffect(() => {
      onChange(layers)
    }, [layers, onChange])

    return (
      <MapEditor
        layers={layers}
        onLayersChange={replace}
        onAddFiles={addFromFiles}
        notification={notification}
        onCloseNotification={close}
        dragPrompt={prompt}
      >
        {layers.length > 0 && (
          <OverlayChip
            icon={<LayersRoundedIcon />}
            label={`${layers.length} area${layers.length > 1 ? 's' : ''}`}
            onDelete={clear}
            color="primary"
            size="small"
          />
        )}
      </MapEditor>
    )
  },
)

GeoFilterMap.displayName = 'GeoFilterMap'
