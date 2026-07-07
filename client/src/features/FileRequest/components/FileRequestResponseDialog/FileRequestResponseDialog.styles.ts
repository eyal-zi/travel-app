import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

// Three-column grid for the large-file metadata fields, keeping them to two rows
// on the wide dialog. Collapses to one column on narrow dialogs.
export const FormGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: theme.spacing(1.5, 2),
  alignItems: 'start',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}))

// The admin body below the full-width Status: input fields on the (wider) left,
// the footprint map on the right, stretched to the same height. Collapses to a
// single column on narrow screens, where the map falls back to its min-height.
export const MainSplit = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)',
  gap: theme.spacing(2, 3),
  alignItems: 'stretch',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}))

// Left column: the stacked input sections (response, metadata, file).
export const FormColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}))

// Right column: the footprint label + map, with the map flexing to fill height.
export const MapColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

// A labelled field (label above the control).
export const Field = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

// A field spanning two of the three columns (e.g. name, which shares its row with
// the file-type select).
export const FieldSpan2 = styled(Field)({
  gridColumn: 'span 2',
})

// A field's label row with a trailing hint (e.g. the accuracy value).
export const FieldHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
})

// Direct-to-S3 upload progress shown under the dropzone: a caption row above the
// bar while the file uploads.
export const UploadStatus = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(1),
}))

// Frames the embedded footprint map with rounded, clipped corners.
export const MapFrame = styled(Box)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  minHeight: 280,
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}))
