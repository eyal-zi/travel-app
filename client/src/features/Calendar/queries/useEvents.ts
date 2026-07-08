import { useQuery } from '@tanstack/react-query'
import { eventService } from '../services/eventService'


export const eventsKey = ['events'] as const


export const useEvents = () => {
  const query = useQuery({
    queryKey: eventsKey,
    queryFn: async () => {
      const { data } = await eventService.list()
      return data
    },
  })

  return {
    events: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
