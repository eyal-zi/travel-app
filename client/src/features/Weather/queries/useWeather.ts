import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { weatherService, type WeatherRecord } from '../services/weatherService'

// Per-date key. The weather image for a date is a singleton, matched on the
// exact date (no closest-preceding fallback).
export const weatherKey = (date: string) => ['weather', date] as const

/**
 * The stored weather image for the date, or null when none. Enabled only while
 * the modal is open so the image isn't fetched for every date in the background.
 */
export const useWeatherForDate = (date: string, enabled: boolean) =>
  useQuery({
    queryKey: weatherKey(date),
    queryFn: () => weatherService.getByDate(date),
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
