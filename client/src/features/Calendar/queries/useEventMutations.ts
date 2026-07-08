import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventService } from '../services/eventService'
import { eventsKey } from './useEvents'
import type { CalendarEvent, EventInput } from '../Calendar.types'

type Snapshot = { previous?: CalendarEvent[] }







export const useEventMutations = () => {
  const queryClient = useQueryClient()

  const writeEvents = (update: (events: CalendarEvent[]) => CalendarEvent[]) =>
    queryClient.setQueryData<CalendarEvent[]>(eventsKey, (events) =>
      update(events ?? []),
    )

  
  const applyOptimistic = async (
    update: (events: CalendarEvent[]) => CalendarEvent[],
  ): Promise<Snapshot> => {
    await queryClient.cancelQueries({ queryKey: eventsKey })
    const previous = queryClient.getQueryData<CalendarEvent[]>(eventsKey)
    writeEvents(update)
    return { previous }
  }

  const rollback = (_error: unknown, _variables: unknown, context?: Snapshot) => {
    if (context?.previous) queryClient.setQueryData(eventsKey, context.previous)
  }

  const createEvent = useMutation({
    mutationFn: (input: EventInput) =>
      eventService.create(input).then((res) => res.data),
    
    onSuccess: (created) => writeEvents((events) => [...events, created]),
  })

  const updateEvent = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<EventInput> }) =>
      eventService.update(id, input).then((res) => res.data),
    onMutate: ({ id, input }) =>
      applyOptimistic((events) =>
        events.map((event) => (event.id === id ? { ...event, ...input } : event)),
      ),
    onError: rollback,
  })

  const removeEvent = useMutation({
    mutationFn: (id: string) => eventService.remove(id).then((res) => res.data),
    onMutate: (id) =>
      applyOptimistic((events) => events.filter((event) => event.id !== id)),
    onError: rollback,
  })

  return { createEvent, updateEvent, removeEvent }
}
