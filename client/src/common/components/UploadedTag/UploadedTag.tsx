import { format } from 'date-fns'
import { TagPill } from './UploadedTag.styles'
import type { UploadedTagProps } from './UploadedTag.types'







export const UploadedTag = ({ date, zIndex = 1 }: UploadedTagProps) => {
  if (!date) return null
  return <TagPill zIndex={zIndex}>Uploaded for {format(new Date(date), 'PP')}</TagPill>
}
