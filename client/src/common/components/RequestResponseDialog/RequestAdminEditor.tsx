import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import UndoRoundedIcon from '@mui/icons-material/UndoRounded'
import { FileDropzone } from '../FileDropzone/FileDropzone'
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_META,
  type RequestStatus,
} from '../../requests/requestStatus'
import type {
  RequestDraft,
  RequestSummary,
} from './RequestResponseDialog.types'
import {
  AdminSections,
  ExistingFileIcon,
  FileLink,
  FileRow,
  Section,
  SectionDivider,
  SectionLabel,
  StagedFileIcon,
  StagedFileName,
  StatusToggle,
} from './RequestResponseDialog.styles'

type RequestAdminEditorProps = {
  request: RequestSummary
  draft: RequestDraft
}

/** Admin editor: status transitions, an editable note, and staged file changes. */
export const RequestAdminEditor = ({ request, draft }: RequestAdminEditorProps) => {
  const {
    statusDraft,
    noteDraft,
    stagedFiles,
    removedFileIds,
    saving,
    setStatus,
    setNote,
    stageFile,
    unstageFile,
    toggleRemoveExisting,
  } = draft

  const files = request.files ?? []

  return (
    <AdminSections>
      <Section>
        <SectionLabel variant="overline" color="text.secondary">
          Status
        </SectionLabel>
        <ToggleButtonGroup
          exclusive
          fullWidth
          size="small"
          value={statusDraft}
          disabled={saving}
          onChange={(_event, value: RequestStatus | null) => {
            if (value) setStatus(value)
          }}
        >
          {REQUEST_STATUSES.map((value) => {
            const meta = REQUEST_STATUS_META[value]
            return (
              <StatusToggle key={value} value={value} statusColor={meta.color}>
                {meta.label}
              </StatusToggle>
            )
          })}
        </ToggleButtonGroup>
      </Section>

      <Section>
        <SectionLabel variant="overline" color="text.secondary">
          Response
        </SectionLabel>
        <TextField
          multiline
          minRows={3}
          maxRows={6}
          size="small"
          fullWidth
          placeholder="Write a note for the requester… (leave empty to remove it)"
          value={noteDraft}
          disabled={saving}
          onChange={(event) => setNote(event.target.value)}
        />
      </Section>

      <SectionDivider />

      <Section>
        <SectionLabel variant="overline" color="text.secondary">
          Attachments
        </SectionLabel>

        {files.length === 0 && stagedFiles.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No files attached.
          </Typography>
        )}

        {files.map((file) => {
          const markedForRemoval = removedFileIds.includes(file.id)
          return (
            <FileRow key={file.id}>
              <ExistingFileIcon />
              <FileLink
                removed={markedForRemoval}
                href={file.signedUrl}
                target="_blank"
                rel="noopener"
                variant="body2"
              >
                {file.fileName}
              </FileLink>
              <IconButton
                size="small"
                aria-label={
                  markedForRemoval ? `Keep ${file.fileName}` : `Remove ${file.fileName}`
                }
                disabled={saving}
                onClick={() => toggleRemoveExisting(file.id)}
              >
                {markedForRemoval ? <UndoRoundedIcon /> : <CloseRoundedIcon />}
              </IconButton>
            </FileRow>
          )
        })}

        {/* Newly chosen files, pending upload on Save */}
        {stagedFiles.map((file, index) => (
          <FileRow key={`staged-${index}`}>
            <StagedFileIcon />
            <StagedFileName variant="body2">
              {file.name}{' '}
              <Typography component="span" variant="caption" color="primary">
                (new)
              </Typography>
            </StagedFileName>
            <IconButton
              size="small"
              aria-label={`Remove ${file.name}`}
              disabled={saving}
              onClick={() => unstageFile(index)}
            >
              <CloseRoundedIcon />
            </IconButton>
          </FileRow>
        ))}

        <FileDropzone
          file={null}
          onFileChange={stageFile}
          accept={{}}
          minHeight={90}
          idlePrompt="Drag a file here, or click to browse"
          renderPreview={() => null}
        />
      </Section>
    </AdminSections>
  )
}
