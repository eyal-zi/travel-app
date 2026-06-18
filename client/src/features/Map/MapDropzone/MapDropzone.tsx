import { useCallback, useEffect, useState } from 'react'
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
import { Map } from '../MapComponent/Map'
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
import { format } from 'date-fns'
import { useGeoLayers } from '../../../common/geo/useGeoLayers'
import { useSelectedDate } from '../../../common/hooks/useSelectedDate'
import { acceptedFileTypes } from '../../../common/geo/parsers'
import type { FeatureCollection } from 'geojson'
import type { GeoLayer } from '../../../common/geo/geo.types'
import type { MapProps } from '../MapComponent/Map.types'
import { mapService } from '../mapService'
import type { Route } from '../types/route.type'

export interface MapDropzoneProps extends Omit<MapProps, 'layers'> {
  name?: string
  onSave?: (layers: GeoLayer[]) => void
}

// A route with no geometry renders as no layers, so an empty FeatureCollection
// (e.g. the closest preceding date itself was emptied) shows a blank map.
const toLayers = (route: Route): GeoLayer[] =>
  route.data.features.length
    ? [{ id: route.id, name: route.name, source: 'api', data: route.data }]
    : []

export const MapDropzone = ({ name = 'My map', onSave, ...mapProps }: MapDropzoneProps) => {
  const [selectedDate] = useSelectedDate()
  const { layers, addFromFiles, remove, reset, error, setError } = useGeoLayers()
  const [committed, setCommitted] = useState<GeoLayer[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [layersAnchor, setLayersAnchor] = useState<HTMLElement | null>(null)

  const pending =
    layers.length !== committed.length ||
    layers.some((layer, i) => layer.id !== committed[i].id)

  const commit = useCallback(
    (next: GeoLayer[]) => {
      reset(next)
      setCommitted(next)
    },
    [reset],
  )

  useEffect(() => {
    if (!selectedDate) return
    let active = true
    setLoading(true)
    mapService
      .findClosest(selectedDate)
      .then(({ data: route }) => {
        if (!active) return
        commit(toLayers(route))
      })
      .catch((err: { response?: { status?: number } }) => {
        if (!active) return
        if (err.response?.status === 404) commit([])
        else setError('Failed to load the map for this date.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [selectedDate, commit, setError])

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length) await addFromFiles(accepted)
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
    if (layers.length <= 1) setLayersAnchor(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const date = selectedDate ?? format(new Date(), 'yyyy-MM-dd')
      const features = layers.flatMap((layer) => layer.data.features)

      if (features.length === 0) {
        // Clearing every layer removes this date's own route so that the next
        // load of this date falls back to the closest preceding route rather
        // than a stored empty one.
        await mapService.removeByDate(date)
      } else {
        const data: FeatureCollection = { type: 'FeatureCollection', features }
        await mapService.create({ name, date, data })
      }

      setCommitted(layers)
      setSaved(true)
      onSave?.(layers)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    reset(committed)
    if (committed.length === 0) setLayersAnchor(null)
  }

  return (
    <DropzoneRoot {...getRootProps()}>
      <input {...getInputProps()} />
      <Map {...mapProps} layers={layers} />
      {isDragActive && <DragOverlay>Drop a KML file to add it to the map</DragOverlay>}
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
