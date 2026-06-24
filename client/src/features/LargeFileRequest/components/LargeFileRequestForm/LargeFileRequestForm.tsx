import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import Select, { type SelectChangeEvent } from '@mui/material/Select'
import Slider from '@mui/material/Slider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import type { FeatureCollection } from 'geojson'
import { GeoFilterMap } from '../GeoFilterMap/GeoFilterMap'
import type { AppliedFilters } from '../../queries/useLargeFileSearch'
import {
  ACCURACY_MAX,
  ACCURACY_MIN,
  LARGE_FILE_TYPE_OPTIONS,
  OTHER_FILE_TYPE,
} from '../../types'
import {
  Actions,
  Field,
  FormCard,
  MapField,
  MapFrame,
} from '../../LargeFileRequest.styles'
import { ChipRow, FieldHeader, SliderWrap } from './LargeFileRequestForm.styles'
import type { GeoLayer } from '../../../../common/geo/geo.types'

const TYPE_OPTIONS = [
  ...LARGE_FILE_TYPE_OPTIONS,
  { value: OTHER_FILE_TYPE, label: 'Other…' },
]

const labelFor = (value: string) =>
  TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value

// Split the free-text "Other" field into trimmed, non-empty type names.
const parseOtherTypes = (text: string) =>
  text
    .split(',')
    .map((type) => type.trim())
    .filter(Boolean)

type OtherTypesFieldProps = {
  // Not named `value`: Select clones menu children with `value: undefined`,
  // which would clobber a `value` prop and leave the input uncontrolled.
  text: string
  onChangeText: (text: string) => void
}

// Lives inside the Select menu, so we stop key/click events from reaching the
// Select (which would otherwise close the menu, type-ahead, or move focus).
const OtherTypesField = ({ text, onChangeText }: OtherTypesFieldProps) => (
  <Box
    sx={{ px: 2, py: 1 }}
    onClickCapture={(event) => event.stopPropagation()}
    onKeyDown={(event) => event.stopPropagation()}
  >
    <TextField
      fullWidth
      size="small"
      autoFocus
      label="Other file types"
      value={text}
      onChange={(event) => onChangeText(event.target.value)}
      placeholder="e.g. geotiff, netcdf"
      helperText="Comma-separated, matched alongside the selected types."
    />
  </Box>
)

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

  // Stable so GeoFilterMap's sync effect doesn't re-run every render.
  const handleAreaChange = useCallback((layers: GeoLayer[]) => {
    setAreaLayers(layers)
  }, [])

  const handleTypesChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target
    setSelectedTypes(typeof value === 'string' ? value.split(',') : value)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    // Fixed selections plus any comma-separated values typed under "Other".
    const fixedTypes = selectedTypes.filter((type) => type !== OTHER_FILE_TYPE)
    const customTypes = selectedTypes.includes(OTHER_FILE_TYPE)
      ? parseOtherTypes(otherText)
      : []
    const fileTypes = [...fixedTypes, ...customTypes]

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

  // Flat list of menu children; the "Other" input is injected right after its
  // option. Kept flat (not nested arrays) so Select's value typing stays intact.
  const typeMenuItems = TYPE_OPTIONS.flatMap((option) => {
    const items = [
      <MenuItem key={option.value} value={option.value}>
        <Checkbox checked={selectedTypes.includes(option.value)} />
        <ListItemText primary={option.label} />
      </MenuItem>,
    ]
    if (
      option.value === OTHER_FILE_TYPE &&
      selectedTypes.includes(OTHER_FILE_TYPE)
    ) {
      items.push(
        <OtherTypesField
          key={`${option.value}-input`}
          text={otherText}
          onChangeText={setOtherText}
        />,
      )
    }
    return items
  })

  return (
    <FormCard onSubmit={handleSubmit}>
      <Field>
        <FormControl fullWidth>
          <InputLabel id="file-types-label">File types</InputLabel>
          <Select
            multiple
            displayEmpty
            labelId="file-types-label"
            value={selectedTypes}
            onChange={handleTypesChange}
            input={<OutlinedInput label="File types" />}
            renderValue={(selected) =>
              selected.length === 0 ? (
                <Typography component="span" color="text.secondary">
                  Any type
                </Typography>
              ) : (
                <ChipRow>
                  {selected.flatMap((value) => {
                    // Show the typed custom types as chips instead of "Other…".
                    if (value === OTHER_FILE_TYPE) {
                      const customs = parseOtherTypes(otherText)
                      return customs.length
                        ? customs.map((custom) => (
                            <Chip
                              key={`other-${custom}`}
                              size="small"
                              label={custom}
                            />
                          ))
                        : [
                            <Chip
                              key={value}
                              size="small"
                              label={labelFor(value)}
                            />,
                          ]
                    }
                    return [
                      <Chip key={value} size="small" label={labelFor(value)} />,
                    ]
                  })}
                </ChipRow>
              )
            }
          >
            {typeMenuItems}
          </Select>
        </FormControl>
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
          <GeoFilterMap onChange={handleAreaChange} />
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
