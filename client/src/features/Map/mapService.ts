import api from "../../common/api/axios";
import type { Route, RouteInput } from "./types/route.type";

// Routes are persisted as GeoJSON via JSON bodies (no multipart/file upload):
// the client parses KML/etc. to GeoJSON locally and the server stores it in a
// jsonb column. KML stays an import-only format.
export const mapService = {
  list: () => api.get<Route[]>("/api/routes"),

  create: (input: RouteInput) => api.post<Route>("/api/routes", input),

  update: (id: string, input: Partial<RouteInput>) =>
    api.put<Route>(`/api/routes/${id}`, input),

  remove: (id: string) => api.delete<void>(`/api/routes/${id}`),
};
