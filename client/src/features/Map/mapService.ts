import api from "../../common/api/axios";
import type { Route, RouteInput } from "./types/route.type";

// Routes are persisted as GeoJSON via JSON bodies (no multipart/file upload):
// the client parses KML/etc. to GeoJSON locally and the server stores it in a
// jsonb column. KML stays an import-only format.
export const mapService = {
  list: () => api.get<Route[]>("/api/routes"),

  // The route for a date: the one on that date, or the closest preceding one.
  // Responds 404 when no route exists on or before the date.
  findClosest: (date: string) =>
    api.get<Route>("/api/routes/closest", { params: { date } }),

  create: (input: RouteInput) => api.post<Route>("/api/routes", input),

  update: (id: string, input: Partial<RouteInput>) =>
    api.put<Route>(`/api/routes/${id}`, input),

  remove: (id: string) => api.delete<void>(`/api/routes/${id}`),

  // Remove the route for a date so the map falls back to the closest preceding
  // date's route. A no-op if that date had no route of its own.
  removeByDate: (date: string) =>
    api.delete<void>("/api/routes", { params: { date } }),
};
