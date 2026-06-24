import { useEffect } from 'react'
import { format } from 'date-fns'
import { MapDropzone } from '../../../common/components/MapDropzone/MapDropzone'
import type { MapDropzoneProps } from '../../../common/components/MapDropzone/MapDropzone.types'
import { Notification } from '../../../common/components/Notification/Notification'
import { useNotification } from '../../../common/hooks/useNotification'
import { useSelectedDate } from '../../../common/hooks/useSelectedDate'
import { todayKey } from '../../../common/utils/date'
import type { GeoLayer } from '../../../common/geo/geo.types'
import { useRouteForDate, useSaveRoute } from '../queries/useRoute'
import type { Route } from '../types/route.type'
import { RouteMapRoot, UploadedTitle } from './RouteMapDropzone.styles'

export interface RouteMapDropzoneProps
  extends Omit<MapDropzoneProps, 'committedLayers' | 'loading' | 'onSave'> {
  name?: string
  onSave?: (layers: GeoLayer[]) => void
}

// Stable empty baseline so MapDropzone's reset effect doesn't fire every render
// while no route is loaded.
const NO_LAYERS: GeoLayer[] = []

// A route with no geometry renders as no layers, so an empty FeatureCollection
// (e.g. the closest preceding date itself was emptied) shows a blank map.
const toLayers = (route: Route): GeoLayer[] =>
  route.data.features.length
    ? [{ id: route.id, name: route.name, source: 'api', data: route.data }]
    : NO_LAYERS

/**
 * Route-backed map dropzone: loads the route for the selected date and persists
 * edits through React Query, delegating all rendering and editing UI to the
 * shared `MapDropzone`.
 */
export const RouteMapDropzone = ({
  name = 'My map',
  onSave,
  ...mapProps
}: RouteMapDropzoneProps) => {
  const [selectedDate] = useSelectedDate()
  const { notification, notifyError, close } = useNotification()

  const { data: route, isLoading, isError } = useRouteForDate(selectedDate)
  const saveRoute = useSaveRoute()

  // Surface a (non-404) load failure; 404s resolve to null and show a blank map.
  useEffect(() => {
    if (isError) notifyError('Failed to load the map for this date.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError])

  const committed = route ? toLayers(route) : NO_LAYERS
  // Only surface the date when a layer was actually fetched.
  const uploadedAt = committed.length > 0 && route ? route.date : null

  // MapDropzone awaits this and surfaces its own save-failed message if it
  // rejects, so let the mutation error propagate via mutateAsync.
  const handleSave = async (layers: GeoLayer[]) => {
    const date = selectedDate ?? todayKey()
    await saveRoute.mutateAsync({ date, name, layers })
    onSave?.(layers)
  }

  return (
    <RouteMapRoot>
      {uploadedAt && (
        <UploadedTitle>Uploaded for {format(new Date(uploadedAt), 'PP')}</UploadedTitle>
      )}
      <MapDropzone
        {...mapProps}
        committedLayers={committed}
        loading={isLoading}
        onSave={handleSave}
      />
      <Notification notification={notification} onClose={close} />
    </RouteMapRoot>
  )
}
