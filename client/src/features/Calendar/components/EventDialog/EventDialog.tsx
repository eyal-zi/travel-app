import { useState } from 'react'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { format, isValid as isValidDate, parseISO } from 'date-fns'
import {
  DateRow,
  DialogHeader,
  FormStack,
  StyledDialog,
  StyledDialogActions,
  Swatch,
  SwatchRow,
} from './EventDialog.styles'
import { EVENT_STYLE_OPTIONS, getMarkingIcon } from '../../eventStyles'
import type { EventDialogProps, EventFormValues } from './EventDialog.types'

const isValid = (values: EventFormValues) =>
  values.title.trim().length > 0 &&
  Boolean(values.start) &&
  Boolean(values.end) &&
  values.end > values.start

const LOCAL_FMT = "yyyy-MM-dd'T'HH:mm"

/** Parse a stored form value (`yyyy-MM-ddTHH:mm`) into a Date for the picker. */
const toDate = (value: string) => {
  if (!value) return null
  const date = parseISO(value)
  return isValidDate(date) ? date : null
}

/** Serialise a picker Date back into the stored form value. */
const fromDate = (date: Date | null, allDay: boolean) => {
  if (!date || !isValidDate(date)) return ''
  return allDay ? `${format(date, 'yyyy-MM-dd')}T00:00` : format(date, LOCAL_FMT)
}

export const EventDialog = ({
  open,
  mode,
  initialValues,
  onSave,
  onClose,
  onDelete,
}: EventDialogProps) => {
  const [values, setValues] = useState<EventFormValues>(initialValues)

  // Reseed the form whenever the dialog (re)opens — the render-phase way (no
  // effect), the same pattern the trip-request response dialog uses.
  const [wasOpen, setWasOpen] = useState(open)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setValues(initialValues)
  }

  const update = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const handleDateChange = (key: 'start' | 'end', date: Date | null) => {
    update(key, fromDate(date, values.allDay))
  }

  const handleSave = () => {
    if (isValid(values)) onSave({ ...values, title: values.title.trim() })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  const endBeforeStart = Boolean(values.start && values.end) && values.end <= values.start

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle component="div">
        <DialogHeader>
          <Typography variant="h5">
            {mode === 'create' ? 'New event' : 'Edit event'}
          </Typography>
          <IconButton onClick={onClose} edge="end" aria-label="Close">
            <CloseRoundedIcon />
          </IconButton>
        </DialogHeader>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormStack>
            <TextField
              label="Title"
              value={values.title}
              onChange={(e) => update('title', e.target.value)}
              autoFocus
              fullWidth
              placeholder="e.g. Trip to Lisbon"
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRow>
                {values.allDay ? (
                  <DatePicker
                    label="Start"
                    format="dd/MM/yyyy"
                    value={toDate(values.start)}
                    onChange={(date) => handleDateChange('start', date)}
                  />
                ) : (
                  <DateTimePicker
                    label="Start"
                    format="dd/MM/yyyy HH:mm"
                    ampm={false}
                    value={toDate(values.start)}
                    onChange={(date) => handleDateChange('start', date)}
                  />
                )}
                {values.allDay ? (
                  <DatePicker
                    label="End"
                    format="dd/MM/yyyy"
                    value={toDate(values.end)}
                    onChange={(date) => handleDateChange('end', date)}
                    slotProps={{
                      textField: {
                        error: endBeforeStart,
                        helperText: endBeforeStart ? 'End must be after start' : ' ',
                      },
                    }}
                  />
                ) : (
                  <DateTimePicker
                    label="End"
                    format="dd/MM/yyyy HH:mm"
                    ampm={false}
                    value={toDate(values.end)}
                    onChange={(date) => handleDateChange('end', date)}
                    slotProps={{
                      textField: {
                        error: endBeforeStart,
                        helperText: endBeforeStart ? 'End must be after start' : ' ',
                      },
                    }}
                  />
                )}
              </DateRow>
            </LocalizationProvider>

            <FormControlLabel
              control={
                <Switch
                  checked={values.allDay}
                  onChange={(e) => update('allDay', e.target.checked)}
                />
              }
              label="All day"
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Marking
              </Typography>
              <SwatchRow>
                {EVENT_STYLE_OPTIONS.map((style) => {
                  const MarkingIcon = getMarkingIcon(style)
                  return (
                    <Swatch
                      key={style}
                      swatchStyle={style}
                      selected={values.style === style}
                      onClick={() => update('style', style)}
                      aria-label={`${style} marking`}
                    >
                      {MarkingIcon && <MarkingIcon fontSize="small" />}
                    </Swatch>
                  )
                })}
              </SwatchRow>
            </Stack>
          </FormStack>
        </DialogContent>

        <StyledDialogActions>
          {mode === 'edit' && onDelete ? (
            <Button
              type="button"
              color="error"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={onDelete}
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <Stack direction="row" spacing={1}>
            <Button type="button" color="inherit" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={!isValid(values)}>
              Save
            </Button>
          </Stack>
        </StyledDialogActions>
      </form>
    </StyledDialog>
  )
}
