import api from '../../../common/api/axios'
import { getOrNull } from '../../../common/api/getOrNull'
import type { Route, RouteInput } from '../types/route.type'




export const mapService = {
  list: () => api.get<Route[]>('/api/routes'),

  
  
  findClosest: (date: string) =>
    getOrNull(api.get<Route>('/api/routes/closest', { params: { date } })),

  create: (input: RouteInput) => api.post<Route>('/api/routes', input),

  update: (id: string, input: Partial<RouteInput>) =>
    api.put<Route>(`/api/routes/${id}`, input),

  remove: (id: string) => api.delete<void>(`/api/routes/${id}`),

  
  
  removeByDate: (date: string) =>
    api.delete<void>('/api/routes', { params: { date } }),
}
