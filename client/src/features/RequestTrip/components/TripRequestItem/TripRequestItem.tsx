import { format } from 'date-fns'
import { formatDay } from '../../../../common/utils/format'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded'
import NotesRoundedIcon from '@mui/icons-material/NotesRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import {
  TIMEZONE_OPTIONS,
  TIME_DIVISION_OPTIONS,
  type TripRequest,
} from '../../types'
import { RequestResponseDialog } from '../../../../common/components/RequestResponseDialog/RequestResponseDialog'
import { useOpenRequestId } from '../../../../common/hooks/useOpenRequestId'
import { useTripRequestDraft } from '../TripRequestResponseDialog/useTripRequestDraft'
import { STATUS_META } from './statusMeta'
import {
  Card,
  CardTop,
  Detail,
  DetailGrid,
  FieldValue,
  Footer,
  GoalTitle,
  Indicators,
  NotesText,
  RequestedRow,
} from './TripRequestItem.styles'

type TripRequestItemProps = {
  request: TripRequest
  // When true, the dialog opens in admin mode (status/note/file editor).
  admin?: boolean
}

const labelFor = (options: { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

const Field = ({ label, value }: { label: string; value: string }) => (
  <Detail>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <FieldValue variant="body2">{value}</FieldValue>
  </Detail>
)

export const TripRequestItem = ({ request, admin }: TripRequestItemProps) => {
  const status = STATUS_META[request.status] ?? STATUS_META.received
  const { openId, openRequest, closeRequest } = useOpenRequestId()
  const open = openId === request.id
  const draft = useTripRequestDraft(request, open)

  const hasNote = Boolean(request.adminNote)
  const fileCount = request.files.length

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
          <Field label="Landmark" value={request.landmark} />
          <Field
            label="Dates"
            value={`${formatDay(request.startDate)} → ${formatDay(request.endDate)}`}
          />
          <Field
            label="Time division"
            value={labelFor(TIME_DIVISION_OPTIONS, request.timeDivision)}
          />
          <Field label="Timezone" value={labelFor(TIMEZONE_OPTIONS, request.timezone)} />
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
