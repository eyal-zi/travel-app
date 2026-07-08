import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { FeatureCollection } from 'geojson'
import type { GeoLayer } from '../../../common/geo/geo.types'
import { mapService } from '../services/mapService'
import type { Route } from '../types/route.type'



export const routeKey = (date: string | null) => ['route', date] as const


export const useRouteForDate = (date: string | null) =>
  useQuery({
    queryKey: routeKey(date),
    queryFn: () => mapService.findClosest(date as string),
    enabled: Boolean(date),
  })

export const useSaveRoute = () => {
  const queryClient = useQueryClient()
  return useMutation({
    
    
    
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
