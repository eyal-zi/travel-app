import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { weatherService, type WeatherRecord } from '../services/weatherService'



export const weatherKey = (date: string) => ['weather', date] as const






export const useWeatherForDate = (date: string, enabled: boolean) =>
  useQuery({
    queryKey: weatherKey(date),
    queryFn: () => weatherService.getClosest(date),
    enabled,
  })

export const useSaveWeather = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ date, image }: { date: string; image: File }) =>
      weatherService.create(date, image).then((res) => res.data),
    onSuccess: (record, { date }) => {
      queryClient.setQueryData<WeatherRecord | null>(weatherKey(date), record)
    },
  })
}

export const useDeleteWeather = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (date: string) => weatherService.remove(date),
    
    
    onSuccess: (_data, date) => {
      queryClient.setQueryData<WeatherRecord | null>(weatherKey(date), null)
    },
  })
}
