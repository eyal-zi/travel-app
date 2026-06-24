import { useQuery } from '@tanstack/react-query'
import { eventService } from '../services/eventService'

// Root key for the calendar's event list; mutations write to this cache directly.
export const eventsKey = ['events'] as const

/** Loads the full event list once and caches it app-wide. */
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
