import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import Box from '@mui/material/Box'
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
import { TripRequestResponseDialog } from '../TripRequestResponseDialog/TripRequestResponseDialog'
import { STATUS_META } from './statusMeta'
import {
  Card,
  CardTop,
  Detail,
  DetailGrid,
  Footer,
  Indicators,
} from './TripRequestItem.styles'

type TripRequestItemProps = {
  request: TripRequest
  // When true, the dialog opens in admin mode (status/note/file editor).
  admin?: boolean
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
  const [open, setOpen] = useState(false)

  const hasNote = Boolean(request.adminNote)
  const fileCount = request.files.length

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <ScheduleRoundedIcon />
            <Typography variant="caption">
              Requested {format(new Date(request.createdAt), 'PP p')}
            </Typography>
          </Box>

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

      <TripRequestResponseDialog
        open={open}
        onClose={() => setOpen(false)}
        request={request}
        admin={admin}
      />
    </>
  )
}
