import api from '../../../common/api/axios'
import type { EventInput, EventRecord } from '../Calendar.types'

// Calendar events are persisted as JSON via the events module. Unlike routes
// (one per date), events are plain id-keyed CRUD: many per day, free to span a
// range.
export const eventService = {
  list: () => api.get<EventRecord[]>('/api/events'),

  create: (input: EventInput) => api.post<EventRecord>('/api/events', input),

  update: (id: string, input: Partial<EventInput>) =>
    api.put<EventRecord>(`/api/events/${id}`, input),

  remove: (id: string) => api.delete<void>(`/api/events/${id}`),
}
