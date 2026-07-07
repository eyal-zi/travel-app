import { useState } from 'react'
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { isValid as isValidDate } from 'date-fns'
import type { FeatureCollection } from 'geojson'
import { GeoFilterMap } from '../../../../common/components/GeoFilterMap/GeoFilterMap'
import { MultiSelectField } from '../../../../common/components/MultiSelectField/MultiSelectField'
import { Notification } from '../../../../common/components/Notification/Notification'
import { useNotification } from '../../../../common/hooks/useNotification'
import { serializeDate } from '../../../../common/utils/date'
import { LARGE_FILE_TYPE_OPTIONS } from '../../../../common/constants/fileTypes'
import type { GeoLayer } from '../../../../common/geo/geo.types'
import { useCreateFileRequest } from '../../queries/useCreateFileRequest'
import { GEO_OPTIONS, type CreateFileRequest } from '../../types'
import {
  Actions,
  FieldGroup,
  FieldRow,
  FormCard,
  FormSection,
  SectionHint,
  SectionLabel,
} from '../../../../common/styles/formLayout'
import {
  FormBody,
  FormMain,
  FormSide,
  MapFrame,
} from './FileRequestForm.styles'

type FormState = {
  tripGoal: string
  country: string
  agency: string
  notes: string
  startDate: Date | null
  endDate: Date | null
}

const INITIAL_STATE: FormState = {
  tripGoal: '',
  country: '',
  agency: '',
  notes: '',
  startDate: null,
  endDate: null,
}

type FileRequestFormProps = {
  // Called after a request is successfully created, so the page can take the
  // user to their requests list. Success feedback is owned by the caller since
  // this form unmounts on navigation.
  onSubmitted?: () => void
}

export const FileRequestForm = ({ onSubmitted }: FileRequestFormProps) => {
  const { submit, isSubmitting } = useCreateFileRequest()
  const { notification, notifyError, close } = useNotification()

  const [values, setValues] = useState<FormState>(INITIAL_STATE)
  const [fileTypes, setFileTypes] = useState<string[]>([])
  const [geo, setGeo] = useState<string[]>([])
  const [areaLayers, setAreaLayers] = useState<GeoLayer[]>([])
  const [showErrors, setShowErrors] = useState(false)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const areaFeatures = areaLayers.flatMap((layer) => layer.data.features)

  const endBeforeStart =
    Boolean(values.startDate && values.endDate) &&
    isValidDate(values.startDate!) &&
    isValidDate(values.endDate!) &&
    values.endDate! < values.startDate!

  const textRequired = (value: string) => showErrors && value.trim().length === 0
  const areaMissing = showErrors && areaFeatures.length === 0
  const fileTypesMissing = showErrors && fileTypes.length === 0
  const geoMissing = showErrors && geo.length === 0

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const filledText =
      values.tripGoal.trim() && values.country.trim() && values.agency.trim()
    const filledDates = values.startDate && values.endDate
    const valid =
      filledText &&
      filledDates &&
      !endBeforeStart &&
      areaFeatures.length > 0 &&
      fileTypes.length > 0 &&
      geo.length > 0

    if (!valid) {
      setShowErrors(true)
      return
    }

    const area: FeatureCollection = {
      type: 'FeatureCollection',
      features: areaFeatures,
    }

    const payload: CreateFileRequest = {
      tripGoal: values.tripGoal.trim(),
      country: values.country.trim(),
      agency: values.agency.trim(),
      startDate: serializeDate(values.startDate),
      endDate: serializeDate(values.endDate),
      area,
      fileTypes: fileTypes,
      geo,
      // Notes are optional — omit when blank rather than sending an empty string.
      ...(values.notes.trim() ? { notes: values.notes.trim() } : {}),
    }

    try {
      await submit(payload)
      setValues(INITIAL_STATE)
      setFileTypes([])
      setGeo([])
      setAreaLayers([])
      setShowErrors(false)
      onSubmitted?.()
    } catch {
      notifyError("Couldn't submit your file request. Please try again.")
    }
  }

  return (
    <>
      <FormCard onSubmit={handleSubmit}>
        <FormBody>
          <FormMain>
            <FormSection>
              <SectionLabel variant="overline">Trip details</SectionLabel>
              <TextField
                label="Trip explanation"
                value={values.tripGoal}
                onChange={(e) => update('tripGoal', e.target.value)}
                fullWidth
                autoFocus
                multiline
                minRows={2}
                placeholder="Describe the trip this file is for"
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
                  label="Agency"
                  value={values.agency}
                  onChange={(e) => update('agency', e.target.value)}
                  placeholder="e.g. Acme Geo"
                  error={textRequired(values.agency)}
                  helperText={textRequired(values.agency) ? 'Required' : ' '}
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
                          showErrors && !values.startDate
                            ? 'Required'
                            : undefined,
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
                        error:
                          endBeforeStart || (showErrors && !values.endDate),
                        helperText: endBeforeStart
                          ? 'End must be after start'
                          : showErrors && !values.endDate
                            ? 'Required'
                            : undefined,
                      },
                    }}
                  />
                </FieldRow>
              </LocalizationProvider>
            </FormSection>

            <FormSection>
              <SectionLabel variant="overline">What you need</SectionLabel>
              <FieldRow>
                <FieldGroup>
                  <MultiSelectField
                    label="File types"
                    emptyText="Select file types"
                    options={LARGE_FILE_TYPE_OPTIONS}
                    value={fileTypes}
                    onChange={setFileTypes}
                    allowCustom
                    helperText="Pick from the list or type your own and press Enter."
                  />
                  {fileTypesMissing && (
                    <FormHelperText error>
                      Select at least one file type
                    </FormHelperText>
                  )}
                </FieldGroup>

                <FieldGroup>
                  <MultiSelectField
                    label="Geo"
                    emptyText="Select geo"
                    options={GEO_OPTIONS}
                    value={geo}
                    onChange={setGeo}
                  />
                  {geoMissing && (
                    <FormHelperText error>
                      Select at least one geo
                    </FormHelperText>
                  )}
                </FieldGroup>
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
          </FormMain>

          <FormSide>
            <SectionLabel variant="overline">Request area</SectionLabel>
            <SectionHint variant="body2">
              Drop a KML, GeoJSON, SHP, CSV or Excel file on the map to define the area.
            </SectionHint>
            <MapFrame>
              <GeoFilterMap
                onChange={setAreaLayers}
                prompt="Drop a KML, GeoJSON, SHP, CSV or Excel file to set the request area"
              />
            </MapFrame>
            {areaMissing && (
              <FormHelperText error>
                Drop a file on the map to define the request area
              </FormHelperText>
            )}
          </FormSide>
        </FormBody>

        <Actions>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </Actions>
      </FormCard>

      <Notification notification={notification} onClose={close} />
    </>
  )
}
