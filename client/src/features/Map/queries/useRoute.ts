import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FeatureCollection } from 'geojson'
import type { GeoLayer } from '../../../common/geo/geo.types'
import { mapService } from '../services/mapService'
import type { Route } from '../types/route.type'

// Per-date key. The route for a date is a singleton: the one stored on that
// date, or the closest preceding one.
export const routeKey = (date: string | null) => ['route', date] as const

/** The route for the date (or closest preceding), or null when none exists. */
export const useRouteForDate = (date: string | null) =>
  useQuery({
    queryKey: routeKey(date),
    queryFn: () => mapService.findClosest(date as string),
    enabled: Boolean(date),
  })

export const useSaveRoute = () => {
  const queryClient = useQueryClient()
  return useMutation({
    // Clearing every layer removes this date's own route (so the next load falls
    // back to the closest preceding one); otherwise the merged features are
    // stored as this date's route.
    mutationFn: async ({
      date,
      name,
      layers,
    }: {
      date: string
      name: string
      layers: GeoLayer[]
    }): Promise<Route | null> => {
      const features = layers.flatMap((layer) => layer.data.features)
      if (features.length === 0) {
        await mapService.removeByDate(date)
        return null
      }
      const data: FeatureCollection = { type: 'FeatureCollection', features }
      const { data: route } = await mapService.create({ name, date, data })
      return route
    },
    onSuccess: (route, { date }) => {
      queryClient.setQueryData<Route | null>(routeKey(date), route)
    },
  })
}
