import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import { Map } from '../MapComponent/Map'
import { ActionBar, DragOverlay, DropzoneRoot, LayerPanel } from './MapDropzone.styles'
import { useGeoLayers } from '../../../common/geo/useGeoLayers'
import { acceptedFileTypes } from '../../../common/geo/parsers'
import type { GeoLayer } from '../../../common/geo/geo.types'
import type { MapProps } from '../MapComponent/Map.types'

export interface MapDropzoneProps extends Omit<MapProps, 'layers'> {
  /**
   * Called when the user confirms the pending layers. No-op today; the seam
   * where persistence (POST to the API) will hook in later.
   */
  onSave?: (layers: GeoLayer[]) => void
}

/**
 * Wraps {@link Map} with a drop target: drop a supported geo file (KML today)
 * and its geometry is parsed to GeoJSON and drawn. Drawn layers are listed in a
 * panel where each can be deleted. Any uncommitted change — a drop or a delete —
 * surfaces a Save/Cancel bar: Save commits the current layers ({@link onSave}),
 * Cancel reverts to the last saved snapshot.
 *
 * The drop-zone is just one source feeding {@link useGeoLayers}; the same hook
 * will later accept layers from the API, while this wrapper and {@link Map}
 * stay unchanged.
 */
export const MapDropzone = ({ onSave, ...mapProps }: MapDropzoneProps) => {
  const { layers, addFromFiles, remove, reset, error, setError } = useGeoLayers()
  // The last saved set, restored on Cancel. `pending` is true while `layers`
  // has uncommitted changes (a fresh drop or a delete).
  const [committed, setCommitted] = useState<GeoLayer[]>([])
  const [pending, setPending] = useState(false)

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return
      // Only enter the pending state once a layer actually parsed and drew, so a
      // failed drop just shows the error instead of a Save/Cancel bar.
      const added = await addFromFiles(accepted)
      if (added > 0) setPending(true)
    },
    [addFromFiles],
  )

  // `noClick`/`noKeyboard`: the map underneath owns clicks (pan/zoom), so only
  // an actual drag-and-drop opens a file — never a stray click on the map.
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    noClick: true,
    noKeyboard: true,
  })

  const handleDelete = (id: string) => {
    remove(id)
    setPending(true)
  }

  const handleSave = () => {
    onSave?.(layers)
    setCommitted(layers)
    setPending(false)
  }

  const handleCancel = () => {
    reset(committed)
    setPending(false)
  }

  return (
    <DropzoneRoot {...getRootProps()}>
      <input {...getInputProps()} />
      <Map {...mapProps} layers={layers} />
      {isDragActive && <DragOverlay>Drop a KML file to add it to the map</DragOverlay>}

      {layers.length > 0 && (
        <LayerPanel>
          <List dense disablePadding>
            {layers.map((layer) => (
              <ListItem
                key={layer.id}
                secondaryAction={
                  <Tooltip title="Delete layer">
                    <IconButton edge="end" size="small" onClick={() => handleDelete(layer.id)}>
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <LayersRoundedIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={layer.name}
                  slotProps={{ primary: { noWrap: true, title: layer.name } }}
                />
              </ListItem>
            ))}
          </List>
        </LayerPanel>
      )}

      {pending && (
        <ActionBar>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckRoundedIcon />}
            onClick={handleSave}
            sx={{ borderRadius: 999, px: 2 }}
          >
            Save
          </Button>
          <Button
            variant="text"
            color="inherit"
            size="small"
            startIcon={<CloseRoundedIcon />}
            onClick={handleCancel}
            sx={{ borderRadius: 999, px: 2 }}
          >
            Cancel
          </Button>
        </ActionBar>
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
