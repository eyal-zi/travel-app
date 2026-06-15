import { useEffect, useState } from 'react'
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
import {
  DateRow,
  DialogHeader,
  FormStack,
  StyledDialog,
  StyledDialogActions,
  Swatch,
  SwatchRow,
} from './EventDialog.styles'
import { EVENT_COLOR_OPTIONS } from './EventDialog.types'
import type { EventDialogProps, EventFormValues } from './EventDialog.types'

/** `true` when the form describes a valid, saveable event. */
const isValid = (values: EventFormValues) =>
  values.title.trim().length > 0 &&
  Boolean(values.start) &&
  Boolean(values.end) &&
  values.end > values.start

/** Strip the time portion for all-day inputs (`type="date"`). */
const toDatePart = (value: string) => value.slice(0, 10)

/**
 * Create/edit dialog for a (potentially multi-day) calendar event. Holds its
 * own form state, seeded from `initialValues` each time it opens.
 */
export const EventDialog = ({
  open,
  mode,
  initialValues,
  onSave,
  onClose,
  onDelete,
}: EventDialogProps) => {
  const [values, setValues] = useState<EventFormValues>(initialValues)

  // Re-seed the form whenever the dialog (re)opens with fresh initial values.
  useEffect(() => {
    if (open) setValues(initialValues)
  }, [open, initialValues])

  const update = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const handleDateChange = (key: 'start' | 'end', raw: string) => {
    // For all-day events the input is `type="date"`; pad back to a full
    // datetime so form state stays uniform.
    update(key, values.allDay ? `${raw}T00:00` : raw)
  }

  const handleSave = () => {
    if (isValid(values)) onSave({ ...values, title: values.title.trim() })
  }

  // Submitting the form (e.g. pressing Enter in any field) saves the event.
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

            <DateRow>
              <TextField
                label="Start"
                type={values.allDay ? 'date' : 'datetime-local'}
                value={values.allDay ? toDatePart(values.start) : values.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="End"
                type={values.allDay ? 'date' : 'datetime-local'}
                value={values.allDay ? toDatePart(values.end) : values.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                error={endBeforeStart}
                helperText={endBeforeStart ? 'End must be after start' : ' '}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </DateRow>

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
                Colour
              </Typography>
              <SwatchRow>
                {EVENT_COLOR_OPTIONS.map((color) => (
                  <Swatch
                    key={color}
                    swatchColor={color}
                    selected={values.color === color}
                    onClick={() => update('color', color)}
                    aria-label={`${color} colour`}
                  />
                ))}
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
