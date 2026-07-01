import { format } from 'date-fns'
import Typography from '@mui/material/Typography'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded'
import type { RequestSummary } from './RequestResponseDialog.types'
import {
  EmptyState,
  FileCard,
  FileCardBody,
  FileIconBadge,
  FileName,
  NoteCard,
  ResponseByline,
  ResponseNoteText,
  Section,
  SectionLabel,
  UserSections,
} from './RequestResponseDialog.styles'

type RequestUserViewProps = {
  request: RequestSummary
}

/** Read-only requester view: the admin's response note and downloadable files. */
export const RequestUserView = ({ request }: RequestUserViewProps) => {
  const hasNote = Boolean(request.adminNote)
  const files = request.files ?? []

  return (
    <UserSections>
      <Section>
        <SectionLabel variant="overline" color="text.secondary">
          Response
        </SectionLabel>
        {hasNote ? (
          <NoteCard>
            <ResponseNoteText variant="body2">{request.adminNote}</ResponseNoteText>
          </NoteCard>
        ) : (
          <EmptyState>
            <ChatBubbleOutlineRoundedIcon />
            <Typography variant="body2">No response yet</Typography>
            <Typography variant="caption">
              You'll see a message here once it's ready.
            </Typography>
          </EmptyState>
        )}
        {/* Who last handled the request and when, so the requester knows who to
            follow up with. */}
        {request.updatedByUsername && (
          <ResponseByline>
            <UpdateRoundedIcon />
            <Typography variant="caption">
              Updated by {request.updatedByUsername} ·{' '}
              {format(new Date(request.updatedAt), 'PP p')}
            </Typography>
          </ResponseByline>
        )}
      </Section>

      <Section>
        <SectionLabel variant="overline" color="text.secondary">
          Attachments{files.length > 0 ? ` · ${files.length}` : ''}
        </SectionLabel>
        {files.length > 0 ? (
          files.map((file) => (
            <FileCard
              key={file.id}
              component="a"
              href={file.signedUrl}
              target="_blank"
              rel="noopener"
            >
              <FileIconBadge>
                <DescriptionRoundedIcon />
              </FileIconBadge>
              <FileCardBody>
                <FileName variant="body2">{file.fileName}</FileName>
                <Typography variant="caption" color="text.secondary">
                  Click to download
                </Typography>
              </FileCardBody>
              <DownloadRoundedIcon color="primary" />
            </FileCard>
          ))
        ) : (
          <EmptyState>
            <FolderOpenRoundedIcon />
            <Typography variant="body2">No files attached</Typography>
          </EmptyState>
        )}
      </Section>
    </UserSections>
  )
}
