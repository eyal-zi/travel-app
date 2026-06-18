import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Alert from '@mui/material/Alert'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover'
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import { Map } from '../MapComponent/Map'
import {
  ActionBar,
  DragOverlay,
  DropzoneRoot,
  LayerControl,
  LayerListContainer,
} from './MapDropzone.styles'
import { useGeoLayers } from '../../../common/geo/useGeoLayers'
import { acceptedFileTypes } from '../../../common/geo/parsers'
import type { FeatureCollection } from 'geojson'
import type { GeoLayer } from '../../../common/geo/geo.types'
import type { MapProps } from '../MapComponent/Map.types'
import { mapService } from '../mapService'

export interface MapDropzoneProps extends Omit<MapProps, 'layers'> {
  /** Name stored for the saved route record. */
  name?: string
  onSave?: (layers: GeoLayer[]) => void
}

export const MapDropzone = ({ name = 'My map', onSave, ...mapProps }: MapDropzoneProps) => {
  const { layers, addFromFiles, remove, reset, error, setError } = useGeoLayers()
  const [committed, setCommitted] = useState<GeoLayer[]>([])
  const [pending, setPending] = useState(false)
  const [saving, setSaving] = useState(false)
  // Id of the single route record that holds the whole map; set after first save.
  const [routeId, setRouteId] = useState<string | null>(null)
  const [layersAnchor, setLayersAnchor] = useState<HTMLElement | null>(null)

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!accepted.length) return
      const added = await addFromFiles(accepted)
      if (added > 0) setPending(true)
    },
    [addFromFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    noClick: true,
    noKeyboard: true,
  })

  const handleDelete = (id: string) => {
    remove(id)
    setPending(true)
    if (layers.length <= 1) setLayersAnchor(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // The whole map is one record: merge every layer into a single GeoJSON
      // FeatureCollection and store it as one route (create, then update).
      const data: FeatureCollection = {
        type: 'FeatureCollection',
        features: layers.flatMap((layer) => layer.data.features),
      }
      const { data: route } = routeId
        ? await mapService.update(routeId, { data })
        : await mapService.create({ name, data })

      setRouteId(route.id)
      setCommitted(layers)
      setPending(false)
      onSave?.(layers)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    reset(committed)
    setPending(false)
    if (committed.length === 0) setLayersAnchor(null)
  }

  return (
    <DropzoneRoot {...getRootProps()}>
      <input {...getInputProps()} />
      <Map {...mapProps} layers={layers} />
      {isDragActive && <DragOverlay>Drop a KML file to add it to the map</DragOverlay>}

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

          <Popover
            open={Boolean(layersAnchor)}
            anchorEl={layersAnchor}
            onClose={() => setLayersAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { mt: 1, borderRadius: 2 } } }}
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
            </LayerListContainer>
          </Popover>
        </>
      )}

      {pending && (
        <ActionBar>
          <Button
            variant="contained"
            size="small"
            startIcon={<CheckRoundedIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ borderRadius: 999, px: 2 }}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            variant="text"
            color="inherit"
            size="small"
            startIcon={<CloseRoundedIcon />}
            onClick={handleCancel}
            disabled={saving}
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
