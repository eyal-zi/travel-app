import { format } from 'date-fns'
import { TagPill } from './UploadedTag.styles'
import type { UploadedTagProps } from './UploadedTag.types'

/**
 * Shared "Uploaded for <date>" pill used by the map, PDF, and weather dropzones
 * to label which date the shown file actually belongs to — it may be a closest-
 * preceding fallback rather than the selected date. Renders nothing when there
 * is no date. The parent must establish a positioning context.
 */
export const UploadedTag = ({ date, zIndex = 1 }: UploadedTagProps) => {
  if (!date) return null
  return <TagPill zIndex={zIndex}>Uploaded for {format(new Date(date), 'PP')}</TagPill>
}
