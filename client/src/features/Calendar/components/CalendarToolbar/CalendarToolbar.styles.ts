import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

export const ToolbarRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  paddingBlockEnd: theme.spacing(0.5),
}))

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  minWidth: 0,
}))

export const PeriodTitle = styled(Typography)(({ theme }) => ({
  minWidth: 0,
  fontWeight: theme.typography.fontWeightBold,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}))

export const SelectedChip = styled(Chip)({
  flexShrink: 0,
})

export const ControlsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
  gap: theme.spacing(1),
}))

export const NavGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  flexShrink: 0,
}))

export const TodayButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightMedium,
  paddingInline: theme.spacing(1.25),
  borderColor: theme.palette.divider,
  color: theme.palette.text.secondary,
}))

export const ViewToggle = styled(ToggleButtonGroup)(({ theme }) => ({
  flexShrink: 0,
  '& .MuiToggleButton-root': {
    border: `1px solid ${theme.palette.divider}`,
    paddingInline: theme.spacing(1.25),
    paddingBlock: theme.spacing(0.5),
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },

  '@container calendar (max-width: 420px)': {
    '& .MuiToggleButton-root': {
      paddingInline: theme.spacing(0.75),
    },
  },
}))

export const AddButton = styled(IconButton)(({ theme }) => ({
  flexShrink: 0,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}))
