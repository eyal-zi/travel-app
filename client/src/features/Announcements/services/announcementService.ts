
// Announcements are newest-first, cursor-paginated reads plus a simple create.

import api from "../../../common/api/axios";
import type { Announcement, AnnouncementPage } from "../Announcements.types";

// The author is set server-side ("System"), so create only sends the text.
export const announcementService = {
  list: (params?: { cursor?: string; limit?: number }) =>
    api.get<AnnouncementPage>('/api/announcements', { params }),

  create: (text: string) =>
    api.post<Announcement>('/api/announcements', { text }),
}
