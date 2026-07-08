import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import { Field } from '../../LargeFileRequest.styles'




export const FiltersGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: theme.spacing(1, 2),
  alignItems: 'start',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}))


export const FieldWide = styled(Field)({
  gridColumn: '1 / -1',
})


export const FieldHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
})


export const SliderWrap = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}))


export const DateRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  '& > *': { flex: 1, minWidth: 0 },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}))
