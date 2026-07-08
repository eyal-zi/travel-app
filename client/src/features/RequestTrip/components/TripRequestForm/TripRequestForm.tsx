import { useState } from 'react'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { isValid as isValidDate } from 'date-fns'
import { Notification } from '../../../../common/components/Notification/Notification'
import { useNotification } from '../../../../common/hooks/useNotification'
import { serializeDate } from '../../../../common/utils/date'
import { useCreateTripRequest } from '../../queries/useCreateTripRequest'
import {
  TIMEZONE_OPTIONS,
  TIME_DIVISION_OPTIONS,
  type CreateTripRequest,
} from '../../types'
import {
  Actions,
  FieldRow,
  FormCard,
  FormSection,
  SectionLabel,
} from '../../../../common/styles/formLayout'

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

type TripRequestFormProps = {
  
  onSubmitted: () => void
  onCancel: () => void
}

export const TripRequestForm = ({ onSubmitted, onCancel }: TripRequestFormProps) => {
  const { submit, isSubmitting } = useCreateTripRequest()
  const { notification, notifyError, notifySuccess, close } = useNotification()

  const [values, setValues] = useState<FormState>(INITIAL_STATE)
  const [showErrors, setShowErrors] = useState(false)

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
      
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
    }

    try {
      await submit(payload)
      notifySuccess('Trip request submitted!')
      setValues(INITIAL_STATE)
      setShowErrors(false)
      
      setTimeout(onSubmitted, 1000)
    } catch {
      notifyError("Couldn't submit your trip request. Please try again.")
    }
  }

  return (
    <>
      <FormCard onSubmit={handleSubmit}>
        <FormSection>
          <SectionLabel variant="overline">Trip details</SectionLabel>
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
        </FormSection>

        <FormSection>
          <SectionLabel variant="overline">When</SectionLabel>
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
              helperText={
                showErrors && !values.timeDivision ? 'Required' : ' '
              }
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
        </FormSection>

        <FormSection>
          <SectionLabel variant="overline">Notes</SectionLabel>
          <TextField
            label="Notes (optional)"
            value={values.notes}
            onChange={(e) => update('notes', e.target.value)}
            fullWidth
            multiline
            minRows={2}
            placeholder="Anything else we should know?"
            helperText=" "
          />
        </FormSection>

        <Actions>
          <Button type="button" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </Actions>
      </FormCard>

      <Notification notification={notification} onClose={close} />
    </>
  )
}
