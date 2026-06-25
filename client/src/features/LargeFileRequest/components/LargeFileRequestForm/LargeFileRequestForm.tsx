import { useState } from 'react'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import type { FeatureCollection } from 'geojson'
import { GeoFilterMap } from '../../../../common/components/GeoFilterMap/GeoFilterMap'
import { MultiSelectField } from '../../../../common/components/MultiSelectField/MultiSelectField'
import { mergeOtherValues } from '../../../../common/components/MultiSelectField/MultiSelectField.utils'
import { LARGE_FILE_TYPE_OPTIONS } from '../../../../common/constants/fileTypes'
import type { AppliedFilters } from '../../queries/useLargeFileSearch'
import { ACCURACY_MAX, ACCURACY_MIN } from '../../types'
import {
  Actions,
  Field,
  FormCard,
  MapField,
  MapFrame,
} from '../../LargeFileRequest.styles'
import { FieldHeader, SliderWrap } from './LargeFileRequestForm.styles'
import type { GeoLayer } from '../../../../common/geo/geo.types'

const ACCURACY_MARKS = [0, 5, 10, 15].map((value) => ({
  value,
  label: String(value),
}))

const DEFAULT_ACCURACY = 7

type LargeFileRequestFormProps = {
  onSearch: (filters: AppliedFilters) => void
  searching?: boolean
}

export const LargeFileRequestForm = ({
  onSearch,
  searching,
}: LargeFileRequestFormProps) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [otherText, setOtherText] = useState('')
  const [accuracy, setAccuracy] = useState(DEFAULT_ACCURACY)
  const [areaLayers, setAreaLayers] = useState<GeoLayer[]>([])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const fileTypes = mergeOtherValues(selectedTypes, otherText)

    // Merge every drawn layer's features into one search-area FeatureCollection.
    const features = areaLayers.flatMap((layer) => layer.data.features)
    const area: FeatureCollection | undefined = features.length
      ? { type: 'FeatureCollection', features }
      : undefined

    onSearch({
      accuracy,
      ...(fileTypes.length ? { fileTypes } : {}),
      ...(area ? { area } : {}),
    })
  }

  return (
    <FormCard onSubmit={handleSubmit}>
      <Field>
        <MultiSelectField
          label="File types"
          emptyText="Any type"
          options={LARGE_FILE_TYPE_OPTIONS}
          value={selectedTypes}
          onChange={setSelectedTypes}
          allowOther
          otherText={otherText}
          onOtherTextChange={setOtherText}
          otherLabel="Other file types"
          otherHelperText="Comma-separated, matched alongside the selected types."
        />
      </Field>

      <Field>
        <FieldHeader>
          <Typography variant="subtitle2">Accuracy</Typography>
          <Typography variant="body2" color="text.secondary">
            matching {Math.max(ACCURACY_MIN, accuracy - 1)}–
            {Math.min(ACCURACY_MAX, accuracy + 1)}
          </Typography>
        </FieldHeader>
        <SliderWrap>
          <Slider
            value={accuracy}
            onChange={(_, value) => setAccuracy(value as number)}
            min={ACCURACY_MIN}
            max={ACCURACY_MAX}
            step={1}
            marks={ACCURACY_MARKS}
            valueLabelDisplay="auto"
          />
        </SliderWrap>
      </Field>

      <MapField>
        <Typography variant="subtitle2">
          Search area{' '}
          <Typography component="span" variant="body2" color="text.secondary">
            — drop a KML, SHP, CSV or Excel file on the map.
          </Typography>
        </Typography>
        <MapFrame>
          <GeoFilterMap onChange={setAreaLayers} />
        </MapFrame>
      </MapField>

      <Actions>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SearchRoundedIcon />}
          disabled={searching}
        >
          {searching ? 'Searching…' : 'Search'}
        </Button>
      </Actions>
    </FormCard>
  )
}
