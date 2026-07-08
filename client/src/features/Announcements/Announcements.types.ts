export type Announcement = {
  id: string
  text: string
  author: string
  
  createdAt: string
}



export type AnnouncementPage = {
  items: Announcement[]
  nextCursor: string | null
}
