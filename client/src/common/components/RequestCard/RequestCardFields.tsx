import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import type { FieldProps, TagDetailProps } from './RequestCard.types'
import { ChipRow, Detail, FieldValue } from './RequestCard.styles'
import { labelFor } from './RequestCard.utils'

// A labelled single-value detail field.
export const Field = ({ label, value }: FieldProps) => (
  <Detail>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <FieldValue variant="body2">{value}</FieldValue>
  </Detail>
)

// A labelled list of tag chips.
export const TagDetail = ({ label, values, options }: TagDetailProps) => (
  <Detail>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <ChipRow>
      {values.map((value) => (
        <Chip key={value} size="small" label={labelFor(options, value)} />
      ))}
    </ChipRow>
  </Detail>
)
