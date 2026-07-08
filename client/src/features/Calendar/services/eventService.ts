import api from '../../../common/api/axios'
import type { EventInput, EventRecord } from '../Calendar.types'




export const eventService = {
  list: () => api.get<EventRecord[]>('/api/events'),

  create: (input: EventInput) => api.post<EventRecord>('/api/events', input),

  update: (id: string, input: Partial<EventInput>) =>
    api.put<EventRecord>(`/api/events/${id}`, input),

  remove: (id: string) => api.delete<void>(`/api/events/${id}`),
}
