import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format, isValid as isValidDate } from 'date-fns'
import { useCreateTripRequest } from '../../queries/useCreateTripRequest'
import {
  TIMEZONE_OPTIONS,
  TIME_DIVISION_OPTIONS,
  type CreateTripRequest,
} from '../../types'
import { Actions, FieldRow, FormCard, FormStack } from '../../RequestTrip.styles'

type FormState = {
  tripGoal: string
  country: string
  landmark: string
  notes: string
  timezone: string
  timeDivision: string
  startDate: Date | null
  endDate: Date | null
}

const INITIAL_STATE: FormState = {
  tripGoal: '',
  country: '',
  landmark: '',
  notes: '',
  timezone: '',
  timeDivision: '',
  startDate: null,
  endDate: null,
}

const serializeDate = (date: Date | null) =>
  date && isValidDate(date) ? format(date, 'yyyy-MM-dd') : ''

type TripRequestFormProps = {
  // Called after a request is submitted successfully (e.g. to switch to the list).
  onSubmitted: () => void
  onCancel: () => void
}

export const TripRequestForm = ({ onSubmitted, onCancel }: TripRequestFormProps) => {
  const { submit, isSubmitting, submitError, resetSubmitError } =
    useCreateTripRequest()

  const [values, setValues] = useState<FormState>(INITIAL_STATE)
  const [showErrors, setShowErrors] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const endBeforeStart =
    Boolean(values.startDate && values.endDate) &&
    isValidDate(values.startDate!) &&
    isValidDate(values.endDate!) &&
    values.endDate! < values.startDate!

  const textRequired = (value: string) => showErrors && value.trim().length === 0

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const filledText =
      values.tripGoal.trim() &&
      values.country.trim() &&
      values.landmark.trim() &&
      values.timezone &&
      values.timeDivision
    const filledDates = values.startDate && values.endDate

    if (!filledText || !filledDates || endBeforeStart) {
      setShowErrors(true)
      return
    }

    const payload: CreateTripRequest = {
      tripGoal: values.tripGoal.trim(),
      country: values.country.trim(),
      landmark: values.landmark.trim(),
      timezone: values.timezone,
      timeDivision: values.timeDivision,
      startDate: serializeDate(values.startDate),
      endDate: serializeDate(values.endDate),
      // Notes are optional — omit when blank rather than sending an empty string.
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
    }

    try {
      await submit(payload)
      setShowSuccess(true)
      setValues(INITIAL_STATE)
      setShowErrors(false)
      // Let the success toast show briefly, then hand back to the list view.
      setTimeout(onSubmitted, 1000)
    } catch {
      // Error surfaced via the submitError snackbar below.
    }
  }

  return (
    <>
      <FormCard onSubmit={handleSubmit}>
        <FormStack>
          <TextField
            label="Trip goal"
            value={values.tripGoal}
            onChange={(e) => update('tripGoal', e.target.value)}
            fullWidth
            autoFocus
            placeholder="e.g. A relaxing week by the coast"
            error={textRequired(values.tripGoal)}
            helperText={textRequired(values.tripGoal) ? 'Required' : ' '}
          />

          <FieldRow>
            <TextField
              label="Country"
              value={values.country}
              onChange={(e) => update('country', e.target.value)}
              placeholder="e.g. France"
              error={textRequired(values.country)}
              helperText={textRequired(values.country) ? 'Required' : ' '}
            />
            <TextField
              label="Landmark"
              value={values.landmark}
              onChange={(e) => update('landmark', e.target.value)}
              placeholder="e.g. Eiffel Tower"
              error={textRequired(values.landmark)}
              helperText={textRequired(values.landmark) ? 'Required' : ' '}
            />
          </FieldRow>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <FieldRow>
              <DatePicker
                label="Start date"
                format="dd/MM/yyyy"
                value={values.startDate}
                onChange={(date) => update('startDate', date)}
                slotProps={{
                  textField: {
                    error: showErrors && !values.startDate,
                    helperText:
                      showErrors && !values.startDate ? 'Required' : ' ',
                  },
                }}
              />
              <DatePicker
                label="End date"
                format="dd/MM/yyyy"
                value={values.endDate}
                onChange={(date) => update('endDate', date)}
                slotProps={{
                  textField: {
                    error: endBeforeStart || (showErrors && !values.endDate),
                    helperText: endBeforeStart
                      ? 'End must be after start'
                      : showErrors && !values.endDate
                        ? 'Required'
                        : ' ',
                  },
                }}
              />
            </FieldRow>
          </LocalizationProvider>

          <FieldRow>
            <TextField
              select
              label="Time division"
              value={values.timeDivision}
              onChange={(e) => update('timeDivision', e.target.value)}
              error={showErrors && !values.timeDivision}
              helperText={showErrors && !values.timeDivision ? 'Required' : ' '}
            >
              {TIME_DIVISION_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Timezone"
              value={values.timezone}
              onChange={(e) => update('timezone', e.target.value)}
              error={showErrors && !values.timezone}
              helperText={showErrors && !values.timezone ? 'Required' : ' '}
            >
              {TIMEZONE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FieldRow>

          <TextField
            label="Notes (optional)"
            value={values.notes}
            onChange={(e) => update('notes', e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder="Anything else we should know?"
            helperText=" "
          />
        </FormStack>

        <Actions>
          <Button type="button" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </Actions>
      </FormCard>

      <Snackbar
        open={submitError}
        autoHideDuration={6000}
        onClose={resetSubmitError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={resetSubmitError}>
          Couldn't submit your trip request. Please try again.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">Trip request submitted!</Alert>
      </Snackbar>
    </>
  )
}
