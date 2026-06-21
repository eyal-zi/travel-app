import { format } from 'date-fns'
import Typography from '@mui/material/Typography'
import type { Announcement } from '../../Announcements.types'
import { Card, Meta } from './AnnouncementItem.styles'

type AnnouncementItemProps = {
  announcement: Announcement
}

export const AnnouncementItem = ({ announcement }: AnnouncementItemProps) => {
  return (
    <Card>
      <Meta>
        <Typography variant="subtitle2" color="primary">
          {announcement.author}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {format(new Date(announcement.createdAt), 'PP p')}
        </Typography>
      </Meta>
      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {announcement.text}
      </Typography>
    </Card>
  )
}
