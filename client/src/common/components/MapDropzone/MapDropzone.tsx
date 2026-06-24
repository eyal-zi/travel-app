import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Alert from '@mui/material/Alert'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import { Map } from '../Map/Map'
import {
  ActionBar,
  ActionButton,
  DragOverlay,
  DropzoneRoot,
  LayerControl,
  LayerListContainer,
  LayerListItemIcon,
  LayerPopover,
} from './MapDropzone.styles'
import { useGeoLayers } from '../../geo/useGeoLayers'
import { acceptedFileTypes } from '../../geo/parsers'
import type { GeoLayer } from '../../geo/geo.types'
import type { MapDropzoneProps } from './MapDropzone.types'

// A stable default so the sync effect below doesn't re-run every render.
const NO_LAYERS: GeoLayer[] = []

/**
 * Pure map + KML dropzone. Renders the map, handles file drag/drop and the
 * layer list, and offers Save/Cancel when the working layers differ from the
 * committed baseline. It owns no persistence — the parent loads `committedLayers`
 * and persists via `onSave`.
 */
export const MapDropzone = ({
  committedLayers = NO_LAYERS,
  loading = false,
  onSave,
  ...mapProps
}: MapDropzoneProps) => {
  const { layers, addFromFiles, remove, reset, error, setError } = useGeoLayers()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [layersAnchor, setLayersAnchor] = useState<HTMLElement | null>(null)

  // Seed/replace the working layers whenever a new committed baseline arrives.
  useEffect(() => {
    reset(committedLayers)
  }, [committedLayers, reset])

  const pending =
    layers.length !== committedLayers.length ||
    layers.some((layer, i) => layer.id !== committedLayers[i].id)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (accepted: File[]) => {
      if (accepted.length) await addFromFiles(accepted)
    },
    accept: acceptedFileTypes,
    noClick: true,
    noKeyboard: true,
  })

  const handleDelete = (id: string) => {
    remove(id)
    if (layers.length <= 1) setLayersAnchor(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(layers)
      setSaved(true)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    reset(committedLayers)
    if (committedLayers.length === 0) setLayersAnchor(null)
  }

  return (
    <DropzoneRoot {...getRootProps()}>
      <input {...getInputProps()} />
      <Map {...mapProps} layers={layers} />
      {isDragActive && (
        <DragOverlay>Drop a KML, SHP, CSV or Excel file to add it to the map</DragOverlay>
      )}
      {loading && <DragOverlay>Loading map…</DragOverlay>}

      {layers.length > 0 && (
        <>
          <LayerControl>
            <Tooltip title="Layers">
              <IconButton size="small" onClick={(e) => setLayersAnchor(e.currentTarget)}>
                <Badge badgeContent={layers.length} color="primary">
                  <LayersRoundedIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>
          </LayerControl>

          <LayerPopover
            open={Boolean(layersAnchor)}
            anchorEl={layersAnchor}
            onClose={() => setLayersAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <LayerListContainer>
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
                    <LayerListItemIcon>
                      <LayersRoundedIcon fontSize="small" color="action" />
                    </LayerListItemIcon>
                    <ListItemText
                      primary={layer.name}
                      slotProps={{ primary: { noWrap: true, title: layer.name } }}
                    />
                  </ListItem>
                ))}
              </List>
            </LayerListContainer>
          </LayerPopover>
        </>
      )}

      {pending && (
        <ActionBar>
          <ActionButton
            variant="contained"
            size="small"
            startIcon={<CheckRoundedIcon />}
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Saving…' : 'Save'}
          </ActionButton>
          <ActionButton
            variant="text"
            color="inherit"
            size="small"
            startIcon={<CloseRoundedIcon />}
            onClick={handleCancel}
            disabled={saving || loading}
          >
            Cancel
          </ActionButton>
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

      <Snackbar
        open={saved}
        autoHideDuration={4000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSaved(false)}>
          Map saved.
        </Alert>
      </Snackbar>
    </DropzoneRoot>
  )
}
