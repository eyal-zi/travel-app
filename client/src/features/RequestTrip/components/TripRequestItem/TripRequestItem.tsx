import { format, parseISO } from 'date-fns'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import {
  TIMEZONE_OPTIONS,
  TIME_DIVISION_OPTIONS,
  TRIP_REQUEST_STATUSES,
  type TripRequest,
  type TripRequestStatus,
} from '../../types'
import { useUpdateTripRequestStatus } from '../../queries/useUpdateTripRequestStatus'
import {
  AdminActions,
  Card,
  CardTop,
  Detail,
  DetailGrid,
  Footer,
} from './TripRequestItem.styles'

type TripRequestItemProps = {
  request: TripRequest
  // When true, render admin status-transition controls.
  admin?: boolean
}

export const STATUS_META: Record<
  TripRequestStatus,
  { label: string; color: 'info' | 'warning' | 'success' }
> = {
  received: { label: 'Received', color: 'info' },
  processing: { label: 'Processing', color: 'warning' },
  done: { label: 'Done', color: 'success' },
}

const labelFor = (options: { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value

// Formats a 'YYYY-MM-DD' date string, falling back to the raw value if unparseable.
const formatDay = (value: string) => {
  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? value : format(date, 'dd MMM yyyy')
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <Detail>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
      {value}
    </Typography>
  </Detail>
)

export const TripRequestItem = ({ request, admin }: TripRequestItemProps) => {
  const status = STATUS_META[request.status] ?? STATUS_META.received
  const { updateStatus, isUpdating, pendingStatus, updateError, resetUpdateError } =
    useUpdateTripRequestStatus()

  return (
    <Card>
      <CardTop>
        <Typography variant="subtitle1" fontWeight={700} sx={{ wordBreak: 'break-word' }}>
          {request.tripGoal}
        </Typography>
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
          <Typography
            variant="body2"
            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {request.notes}
          </Typography>
        </Detail>
      )}

      <Footer>
        <ScheduleRoundedIcon />
        <Typography variant="caption">
          Requested {format(new Date(request.createdAt), 'PP p')}
        </Typography>
      </Footer>

      {admin && (
        <AdminActions>
          <Typography variant="caption" color="text.secondary">
            Set status
          </Typography>
          {TRIP_REQUEST_STATUSES.filter((value) => value !== request.status).map(
            (value) => {
              const isThisPending = pendingStatus === value
              return (
                <Button
                  key={value}
                  size="small"
                  variant="outlined"
                  color={STATUS_META[value].color}
                  disabled={isUpdating}
                  startIcon={
                    isThisPending ? <CircularProgress size={14} color="inherit" /> : undefined
                  }
                  onClick={() => updateStatus({ id: request.id, status: value })}
                >
                  {STATUS_META[value].label}
                </Button>
              )
            },
          )}
        </AdminActions>
      )}

      <Snackbar
        open={updateError}
        autoHideDuration={5000}
        onClose={resetUpdateError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={resetUpdateError}>
          Couldn't update the status. Please try again.
        </Alert>
      </Snackbar>
    </Card>
  )
}
