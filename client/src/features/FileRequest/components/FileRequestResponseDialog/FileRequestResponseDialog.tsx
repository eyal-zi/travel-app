import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useRef } from 'react'
import { Notification } from '../../../../common/components/Notification/Notification'
import { FileDropzone } from '../../../../common/components/FileDropzone/FileDropzone'
import { isParseable } from '../../../../common/geo/parsers'
import {
  GeoFilterMap,
  type GeoFilterMapHandle,
} from '../../../../common/components/GeoFilterMap/GeoFilterMap'
import { LargeFileResultItem } from '../../../LargeFileRequest/components/LargeFileResultItem/LargeFileResultItem'
import { LARGE_FILE_TYPE_OPTIONS } from '../../../../common/constants/fileTypes'
import { MultiSelectField } from '../../../../common/components/MultiSelectField/MultiSelectField'
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_META,
  type RequestStatus,
} from '../../../../common/requests/requestStatus'
import { ACCURACY_MAX, ACCURACY_MIN } from '../../../LargeFileRequest/types'
import {
  AdminSections,
  DialogGoalTitle,
  DialogHeader,
  DialogTitleBar,
  EmptyState,
  NoteCard,
  ResponseNoteText,
  Section,
  SectionLabel,
  StatusChip,
  StatusToggle,
  StyledDialog,
  TitleColumn,
  UserSections,
} from '../../../../common/components/RequestResponseDialog/RequestResponseDialog.styles'
import {
  Field,
  FieldHeader,
  FieldSpan2,
  FormColumn,
  FormGrid,
  MainSplit,
  MapColumn,
  MapFrame,
} from './FileRequestResponseDialog.styles'
import type {
  FileRequestResponseDraft,
  FileRequestResponseDialogProps,
} from './FileRequestResponseDialog.types'
import type { FileRequest } from '../../types'

/** Admin large-file form: status, note, and the metadata + file that fulfil the request. */
const AdminForm = ({ draft }: { draft: FileRequestResponseDraft }) => {
  const {
    statusDraft,
    note,
    name,
    fileType,
    accuracy,
    country,
    coverageDate,
    file,
    saving,
    setStatus,
    setNote,
    setName,
    setFileType,
    setAccuracy,
    setCountry,
    setCoverageDate,
    setAreaLayers,
    setFile,
  } = draft

  // Picking the fulfilling file also renders its footprint on the map when the
  // format is parseable (e.g. GeoTIFF's extent). Formats with no browser parser
  // (e.g. ECW) upload normally and keep a hand-drawn footprint.
  const mapRef = useRef<GeoFilterMapHandle>(null)
  const handleFileChange = (next: File) => {
    setFile(next)
    if (isParseable(next)) mapRef.current?.addFiles([next])
  }

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

      <Divider />

      <MainSplit>
        <FormColumn>
          <Section>
            <SectionLabel variant="overline" color="text.secondary">
              Response
            </SectionLabel>
            <TextField
              multiline
              minRows={2}
              maxRows={5}
              size="small"
              fullWidth
              placeholder="Write a note for the requester… (leave empty to remove it)"
              value={note}
              disabled={saving}
              onChange={(event) => setNote(event.target.value)}
            />
          </Section>

          <Section>
            <FormGrid>
              <FieldSpan2>
                <Typography variant="subtitle2">Name</Typography>
                <TextField
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Alpine elevation 2025"
                  size="small"
                  fullWidth
                  disabled={saving}
                />
              </FieldSpan2>

              <Field>
                <Typography variant="subtitle2">File type</Typography>
                <MultiSelectField
                  label=""
                  emptyText="Select a file type"
                  options={LARGE_FILE_TYPE_OPTIONS}
                  // The fulfilling file has a single type — single-select mode.
                  multiple={false}
                  value={fileType ? [fileType] : []}
                  onChange={(values) => setFileType(values[0] ?? '')}
                  allowCustom
                  disabled={saving}
                  helperText="Pick from the list or type your own and press Enter."
                />
              </Field>

              <Field>
                <FieldHeader>
                  <Typography variant="subtitle2">Accuracy</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {accuracy}
                  </Typography>
                </FieldHeader>
                <Slider
                  value={accuracy}
                  onChange={(_event, value) => setAccuracy(value as number)}
                  min={ACCURACY_MIN}
                  max={ACCURACY_MAX}
                  step={1}
                  valueLabelDisplay="auto"
                  disabled={saving}
                />
              </Field>

              <Field>
                <Typography variant="subtitle2">Country</Typography>
                <TextField
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="Optional"
                  size="small"
                  fullWidth
                  disabled={saving}
                />
              </Field>

              <Field>
                <Typography variant="subtitle2">Coverage date</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    format="dd/MM/yyyy"
                    value={coverageDate}
                    onChange={setCoverageDate}
                    disabled={saving}
                    slotProps={{
                      textField: { size: 'small', fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Field>
            </FormGrid>
          </Section>

          <Section>
            <SectionLabel variant="overline" color="text.secondary">
              File
            </SectionLabel>
            <FileDropzone
              file={file}
              onFileChange={handleFileChange}
              accept={{}}
              minHeight={100}
              idlePrompt="Drag the file here, or click to browse"
              renderPreview={() => (
                <Typography variant="body2">{file?.name}</Typography>
              )}
            />
          </Section>
        </FormColumn>

        <MapColumn>
          <SectionLabel variant="overline" color="text.secondary">
            Footprint
          </SectionLabel>
          <MapFrame>
            <GeoFilterMap
              ref={mapRef}
              onChange={setAreaLayers}
              prompt="Drop a KML, GeoJSON, SHP, CSV, Excel or GeoTIFF file to set the footprint"
            />
          </MapFrame>
        </MapColumn>
      </MainSplit>
    </AdminSections>
  )
}

/** Requester view: the admin's note and the fulfilling large file as a search-style card. */
const RequesterView = ({ request }: { request: FileRequest }) => (
  <UserSections>
    <Section>
      <SectionLabel variant="overline" color="text.secondary">
        Response
      </SectionLabel>
      {request.adminNote ? (
        <NoteCard>
          <ResponseNoteText variant="body2">
            {request.adminNote}
          </ResponseNoteText>
        </NoteCard>
      ) : (
        <EmptyState>
          <ChatBubbleOutlineRoundedIcon />
          <Typography variant="body2">No response yet</Typography>
        </EmptyState>
      )}
    </Section>

    <Section>
      <SectionLabel variant="overline" color="text.secondary">
        File
      </SectionLabel>
      {request.largeFile ? (
        <LargeFileResultItem file={request.largeFile} />
      ) : (
        <EmptyState>
          <FolderOpenRoundedIcon />
          <Typography variant="body2">No file yet</Typography>
        </EmptyState>
      )}
    </Section>
  </UserSections>
)

/**
 * The file-request response dialog. For admins it is a full large-file creation
 * form (status/note + metadata + footprint + file) whose Save creates the large
 * file and links it; for requesters it shows the resulting file as a search-style
 * card. Feature-specific — passed to the shared RequestCard via `renderDialog`.
 */
export const FileRequestResponseDialog = ({
  open,
  onClose,
  request,
  draft,
  admin,
}: FileRequestResponseDialogProps) => {
  const { saving, canSave, submit, notification, closeNotification } = draft
  const status =
    REQUEST_STATUS_META[request.status] ?? REQUEST_STATUS_META.received

  const handleSave = async () => {
    if (await submit()) onClose()
  }

  return (
    <>
      <StyledDialog
        open={open}
        onClose={saving ? undefined : onClose}
        scroll="paper"
        width={admin ? 1200 : undefined}
      >
        <DialogTitleBar component="div">
          <DialogHeader>
            <TitleColumn>
              <DialogGoalTitle variant="h6">{request.tripGoal}</DialogGoalTitle>
              <StatusChip
                label={status.label}
                color={status.color}
                size="small"
              />
            </TitleColumn>
            <IconButton
              onClick={onClose}
              edge="end"
              aria-label="Close"
              disabled={saving}
            >
              <CloseRoundedIcon />
            </IconButton>
          </DialogHeader>
        </DialogTitleBar>

        <DialogContent dividers>
          {admin ? (
            <AdminForm draft={draft} />
          ) : (
            <RequesterView request={request} />
          )}
        </DialogContent>

        {admin && (
          <DialogActions>
            <Button onClick={onClose} color="inherit" disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!canSave || saving}
              startIcon={
                saving ? (
                  <CircularProgress size={14} color="inherit" />
                ) : undefined
              }
            >
              {saving ? 'Saving…' : 'Create file & respond'}
            </Button>
          </DialogActions>
        )}
      </StyledDialog>

      <Notification notification={notification} onClose={closeNotification} />
    </>
  )
}
