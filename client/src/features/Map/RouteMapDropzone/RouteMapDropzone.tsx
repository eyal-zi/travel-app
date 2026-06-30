import { useEffect, useMemo, useState } from 'react'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Tooltip from '@mui/material/Tooltip'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import LayersRoundedIcon from '@mui/icons-material/LayersRounded'
import { MapEditor } from '../../../common/components/MapEditor/MapEditor'
import { UploadedTag } from '../../../common/components/UploadedTag/UploadedTag'
import { useGeoLayers } from '../../../common/geo/useGeoLayers'
import { useNotification } from '../../../common/hooks/useNotification'
import { useSelectedDate } from '../../../common/hooks/useSelectedDate'
import { todayKey } from '../../../common/utils/date'
import type { GeoLayer } from '../../../common/geo/geo.types'
import { useRouteForDate, useSaveRoute } from '../queries/useRoute'
import { useIsAdmin } from '../../Auth/hooks/useIsAdmin'
import type { Route } from '../types/route.type'
import {
  ActionBar,
  ActionButton,
  LayerControl,
  LayerListContainer,
  LayerListItemIcon,
  LayerPopover,
  RouteMapRoot,
} from './RouteMapDropzone.styles'
import type { RouteMapDropzoneProps } from './RouteMapDropzone.types'

// Stable empty baseline so the reset effect doesn't fire every render while no
// route is loaded.
const NO_LAYERS: GeoLayer[] = []

// A route with no geometry renders as no layers, so an empty FeatureCollection
// (e.g. the closest preceding date itself was emptied) shows a blank map.
const toLayers = (route: Route): GeoLayer[] =>
  route.data.features.length
    ? [{ id: route.id, name: route.name, source: 'api', data: route.data }]
    : NO_LAYERS

/**
 * Route editor: loads the route for the selected date, lets the user drop files
 * or draw/edit/delete shapes on the shared `MapEditor`, and persists the working
 * layers through React Query on Save. Owns the working-vs-committed diff and the
 * Save/Cancel + layer-list UI; the map and file-drop wiring live in `MapEditor`.
 */
export const RouteMapDropzone = ({
  name = 'My map',
  onSave,
  center,
  zoom,
}: RouteMapDropzoneProps) => {
  const [selectedDate] = useSelectedDate()
  const canEdit = useIsAdmin()
  const { notification, notifyError, notifySuccess, close } = useNotification()
  const { layers, addFromFiles, remove, reset, replace } = useGeoLayers(notifyError)
  const [saving, setSaving] = useState(false)
  const [layersAnchor, setLayersAnchor] = useState<HTMLElement | null>(null)

  const { data: route, isLoading, isError } = useRouteForDate(selectedDate)
  const saveRoute = useSaveRoute()

  const committed = route ? toLayers(route) : NO_LAYERS
  // Only surface the date when a layer was actually fetched.
  const uploadedAt = committed.length > 0 && route ? route.date : null

  // Seed/replace the working layers whenever a new committed baseline arrives.
  useEffect(() => {
    reset(committed)
    // committed is derived from `route`; depend on it to avoid resetting each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, reset])

  // Surface a (non-404) load failure; 404s resolve to null and show a blank map.
  useEffect(() => {
    if (isError) notifyError('Failed to load the map for this date.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  // Drawing/editing reshapes geometry without necessarily changing layer ids or
  // counts (a route is one layer with many features), so compare the serialised
  // data too — not just identity — otherwise Save/Cancel never surface for edits.
  const pending = useMemo(() => {
    if (layers.length !== committed.length) return true
    return layers.some((layer, i) => {
      const base = committed[i]
      return layer.id !== base.id || JSON.stringify(layer.data) !== JSON.stringify(base.data)
    })
  }, [layers, committed])

  const handleDelete = (id: string) => {
    remove(id)
    if (layers.length <= 1) setLayersAnchor(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const date = selectedDate ?? todayKey()
      await saveRoute.mutateAsync({ date, name, layers })
      onSave?.(layers)
      notifySuccess('Map saved.')
    } catch {
      notifyError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    reset(committed)
    if (committed.length === 0) setLayersAnchor(null)
  }

  return (
    <RouteMapRoot>
      <UploadedTag date={uploadedAt} zIndex={1000} />
      <MapEditor
        center={center}
        zoom={zoom}
        editable={canEdit}
        layers={layers}
        onLayersChange={replace}
        onAddFiles={addFromFiles}
        notification={notification}
        onCloseNotification={close}
        loading={isLoading}
      >
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
                        canEdit ? (
                          <Tooltip title="Delete layer">
                            <IconButton edge="end" size="small" onClick={() => handleDelete(layer.id)}>
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : null
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

        {canEdit && pending && (
          <ActionBar>
            <ActionButton
              variant="contained"
              size="small"
              startIcon={<CheckRoundedIcon />}
              onClick={handleSave}
              disabled={saving || isLoading}
            >
              {saving ? 'Saving…' : 'Save'}
            </ActionButton>
            <ActionButton
              variant="text"
              color="inherit"
              size="small"
              startIcon={<CloseRoundedIcon />}
              onClick={handleCancel}
              disabled={saving || isLoading}
            >
              Cancel
            </ActionButton>
          </ActionBar>
        )}
      </MapEditor>
    </RouteMapRoot>
  )
}
