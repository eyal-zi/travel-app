import { format } from 'date-fns'
import Typography from '@mui/material/Typography'
import { Card, Meta, MessageText } from './AnnouncementItem.styles'
import type { AnnouncementItemProps } from './AnnouncementItem.types'

export const AnnouncementItem = ({ announcement }: AnnouncementItemProps) => (
  <Card>
    <Meta>
      <Typography variant="subtitle2" color="primary">
        {announcement.author}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {format(new Date(announcement.createdAt), 'PP p')}
      </Typography>
    </Meta>
    <MessageText variant="body2">{announcement.text}</MessageText>
  </Card>
)
