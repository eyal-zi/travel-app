import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { MapDropzone } from '../../../common/components/MapDropzone/MapDropzone'
import type { MapDropzoneProps } from '../../../common/components/MapDropzone/MapDropzone.types'
import { RouteMapRoot, UploadedTitle } from './RouteMapDropzone.styles'
import { useSelectedDate } from '../../../common/hooks/useSelectedDate'
import type { GeoLayer } from '../../../common/geo/geo.types'
import type { FeatureCollection } from 'geojson'
import { mapService } from '../mapService'
import type { Route } from '../types/route.type'

export interface RouteMapDropzoneProps
  extends Omit<MapDropzoneProps, 'committedLayers' | 'loading' | 'onSave'> {
  name?: string
  onSave?: (layers: GeoLayer[]) => void
}

// A route with no geometry renders as no layers, so an empty FeatureCollection
// (e.g. the closest preceding date itself was emptied) shows a blank map.
const toLayers = (route: Route): GeoLayer[] =>
  route.data.features.length
    ? [{ id: route.id, name: route.name, source: 'api', data: route.data }]
    : []

/**
 * Route-backed map dropzone: loads the route for the selected date and persists
 * edits through `mapService`, delegating all rendering and editing UI to the
 * shared `MapDropzone`.
 */
export const RouteMapDropzone = ({ name = 'My map', onSave, ...mapProps }: RouteMapDropzoneProps) => {
  const [selectedDate] = useSelectedDate()
  const [committed, setCommitted] = useState<GeoLayer[]>([])
  const [uploadedAt, setUploadedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedDate) return
    let active = true

    const load = async () => {
      setLoading(true)
      try {
        const { data: route } = await mapService.findClosest(selectedDate)
        if (active) {
          const layers = toLayers(route)
          setCommitted(layers)
          // Only surface the date when a layer was actually fetched.
          setUploadedAt(layers.length ? route.date : null)
        }
      } catch (err) {
        if (!active) return
        if ((err as { response?: { status?: number } }).response?.status === 404) {
          setCommitted([])
          setUploadedAt(null)
        } else {
          setLoadError('Failed to load the map for this date.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [selectedDate])

  const handleSave = useCallback(
    async (layers: GeoLayer[]) => {
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
      // Saving binds the map to this date; clearing it drops the title.
      setUploadedAt(features.length ? date : null)
      onSave?.(layers)
    },
    [selectedDate, name, onSave],
  )

  return (
    <RouteMapRoot>
      {uploadedAt && <UploadedTitle>Uploaded for {format(new Date(uploadedAt), 'PP')}</UploadedTitle>}
      <MapDropzone
        {...mapProps}
        committedLayers={committed}
        loading={loading}
        onSave={handleSave}
      />
      <Snackbar
        open={Boolean(loadError)}
        autoHideDuration={6000}
        onClose={() => setLoadError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setLoadError(null)}>
          {loadError}
        </Alert>
      </Snackbar>
    </RouteMapRoot>
  )
}
