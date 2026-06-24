import Typography from '@mui/material/Typography'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import type { TripRequest } from '../../types'
import {
  EmptyState,
  FileCard,
  FileCardBody,
  FileIconBadge,
  FileName,
  NoteCard,
  ResponseNoteText,
  Section,
  SectionLabel,
  UserSections,
} from './TripRequestResponseDialog.styles'

type TripRequestUserViewProps = {
  request: TripRequest
}

/** Read-only requester view: the admin's response note and downloadable files. */
export const TripRequestUserView = ({ request }: TripRequestUserViewProps) => {
  const hasNote = Boolean(request.adminNote)

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
      </Section>

      <Section>
        <SectionLabel variant="overline" color="text.secondary">
          Attachments{request.files.length > 0 ? ` · ${request.files.length}` : ''}
        </SectionLabel>
        {request.files.length > 0 ? (
          request.files.map((file) => (
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
