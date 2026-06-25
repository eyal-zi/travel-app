import { format } from 'date-fns'
import { formatDay } from '../../../../common/utils/format'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import NotesRoundedIcon from '@mui/icons-material/NotesRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import { RequestResponseDialog } from '../../../../common/components/RequestResponseDialog/RequestResponseDialog'
import { useOpenRequestId } from '../../../../common/hooks/useOpenRequestId'
import { LARGE_FILE_TYPE_OPTIONS } from '../../../../common/constants/fileTypes'
import { REQUEST_STATUS_META } from '../../../../common/requests/requestStatus'
import type { SelectOption } from '../../../../common/types'
import { useFileRequestDraft } from '../FileRequestResponseDialog/useFileRequestDraft'
import { GEO_OPTIONS, type FileRequest } from '../../types'
import {
  Card,
  CardTop,
  ChipRow,
  Detail,
  DetailGrid,
  FieldValue,
  Footer,
  GoalTitle,
  Indicators,
  NotesText,
  RequestedRow,
} from './FileRequestItem.styles'

type FileRequestItemProps = {
  request: FileRequest
  // When true, the dialog opens in admin mode (status/note/file editor).
  admin?: boolean
}

const labelFor = (options: SelectOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

const Field = ({ label, value }: { label: string; value: string }) => (
  <Detail>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <FieldValue variant="body2">{value}</FieldValue>
  </Detail>
)

const TagDetail = ({
  label,
  values,
  options,
}: {
  label: string
  values: string[]
  options: SelectOption[]
}) => (
  <Detail>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <ChipRow>
      {values.map((value) => (
        <Chip key={value} size="small" label={labelFor(options, value)} />
      ))}
    </ChipRow>
  </Detail>
)

export const FileRequestItem = ({ request, admin }: FileRequestItemProps) => {
  const status = REQUEST_STATUS_META[request.status] ?? REQUEST_STATUS_META.received
  const { openId, openRequest, closeRequest } = useOpenRequestId()
  const open = openId === request.id
  const draft = useFileRequestDraft(request, open)

  const hasNote = Boolean(request.adminNote)
  const fileCount = request.files.length
  const areaCount = request.area.features.length

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => openRequest(request.id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openRequest(request.id)
          }
        }}
      >
        <CardTop>
          <GoalTitle variant="subtitle1">{request.tripGoal}</GoalTitle>
          <Chip label={status.label} color={status.color} size="small" />
        </CardTop>

        <DetailGrid>
          <Field label="Country" value={request.country} />
          <Field label="Agency" value={request.agency} />
          <Field
            label="Dates"
            value={`${formatDay(request.startDate)} → ${formatDay(request.endDate)}`}
          />
          <Field
            label="Area"
            value={`${areaCount} feature${areaCount === 1 ? '' : 's'}`}
          />
          <TagDetail
            label="File types"
            values={request.fileTypes}
            options={LARGE_FILE_TYPE_OPTIONS}
          />
          <TagDetail label="Geo" values={request.geo} options={GEO_OPTIONS} />
        </DetailGrid>

        {request.notes && (
          <Detail>
            <Typography variant="caption" color="text.secondary">
              Notes
            </Typography>
            <NotesText variant="body2">{request.notes}</NotesText>
          </Detail>
        )}

        <Footer>
          <RequestedRow>
            <ScheduleRoundedIcon />
            <Typography variant="caption">
              Requested {format(new Date(request.createdAt), 'PP p')}
            </Typography>
          </RequestedRow>

          {/* Small indicators that the admin has responded. */}
          {(hasNote || fileCount > 0) && (
            <Indicators>
              {hasNote && (
                <Chip
                  icon={<NotesRoundedIcon />}
                  label="Response"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {fileCount > 0 && (
                <Chip
                  icon={<AttachFileRoundedIcon />}
                  label={fileCount}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Indicators>
          )}
        </Footer>
      </Card>

      <RequestResponseDialog
        open={open}
        onClose={closeRequest}
        request={request}
        draft={draft}
        admin={admin}
      />
    </>
  )
}
