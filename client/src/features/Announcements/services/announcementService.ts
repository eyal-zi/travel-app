


import api from "../../../common/api/axios";
import type { Announcement, AnnouncementPage } from "../Announcements.types";


export const announcementService = {
  list: (params?: { cursor?: string; limit?: number }) =>
    api.get<AnnouncementPage>('/api/announcements', { params }),

  create: (text: string) =>
    api.post<Announcement>('/api/announcements', { text }),
}
