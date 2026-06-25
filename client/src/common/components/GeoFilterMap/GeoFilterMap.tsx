import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import { Map } from '../Map/Map'
import { useGeoLayers } from '../../geo/useGeoLayers'
import { acceptedFileTypes } from '../../geo/parsers'
import { DragOverlay, DropzoneRoot } from '../MapDropzone/MapDropzone.styles'
import type { GeoLayer } from '../../geo/geo.types'
import { OverlayChip } from './GeoFilterMap.styles'

const DEFAULT_PROMPT = 'Drop a KML, SHP, CSV or Excel file to set the search area'

type GeoFilterMapProps = {
  // Called whenever the drawn layers change, so the parent can derive the
  // selected area. Memoize it to keep the sync effect stable.
  onChange: (layers: GeoLayer[]) => void
  // Overlay text shown while dragging a file over the map.
  prompt?: string
}

/**
 * A map dropzone: drop geo files (KML/SHP/CSV/Excel) to define an area. Unlike
 * the shared MapDropzone it has no Save/Cancel or persistence — it just renders
 * the dropped geometry and reports the live layers to the parent via `onChange`.
 * Reuses the Map renderer, the geo parsing hook and the accepted-file-type map.
 */
export const GeoFilterMap = ({
  onChange,
  prompt = DEFAULT_PROMPT,
}: GeoFilterMapProps) => {
  const { layers, addFromFiles, clear, error, setError } = useGeoLayers()

  // Surface the current layers to the parent whenever they change.
  useEffect(() => {
    onChange(layers)
  }, [layers, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (accepted: File[]) => {
      if (accepted.length) await addFromFiles(accepted)
    },
    accept: acceptedFileTypes,
    noClick: true,
    noKeyboard: true,
  })

  return (
    <DropzoneRoot {...getRootProps()}>
      <input {...getInputProps()} />
      <Map layers={layers} />

      {isDragActive && <DragOverlay>{prompt}</DragOverlay>}

      {layers.length > 0 && (
        <OverlayChip
          icon={<LayersRoundedIcon />}
          label={`${layers.length} area${layers.length > 1 ? 's' : ''}`}
          onDelete={clear}
          color="primary"
          size="small"
        />
      )}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </DropzoneRoot>
  )
}
