export type Announcement = {
  id: string
  text: string
  author: string
  // ISO timestamp of when the announcement was posted.
  createdAt: string
}

// A newest-first page of announcements. `nextCursor` is the createdAt to pass
// back for the next (older) page, or null when there are no older items left.
export type AnnouncementPage = {
  items: Announcement[]
  nextCursor: string | null
}
