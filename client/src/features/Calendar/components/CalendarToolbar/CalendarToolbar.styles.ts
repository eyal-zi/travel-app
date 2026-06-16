import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

export const ToolbarRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  paddingBlock: theme.spacing(1.5),
  '& > :last-child': {
    marginInlineStart: 'auto',
  },

  '@container calendar (max-width: 600px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1),
    '& > :last-child': {
      marginInlineStart: 0,
    },
    '& > .MuiChip-root': {
      alignSelf: 'center',
    },
    '& .MuiButton-root': {
      paddingInline: theme.spacing(1),
      paddingBlock: theme.spacing(0.375),
      fontSize: theme.typography.caption.fontSize,
      minHeight: 0,
    },
    '& .MuiButton-startIcon': {
      marginInlineEnd: theme.spacing(0.25),
      '& > *:first-of-type': {
        fontSize: '0.95rem',
      },
    },
    '& .MuiIconButton-root': {
      padding: theme.spacing(0.5),
    },
  },
}))

export const NavGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),

  '@container calendar (max-width: 600px)': {
    justifyContent: 'center',
  },
}))

export const PeriodTitle = styled(Typography)(({ theme }) => ({
  minWidth: 0,
  marginInline: theme.spacing(0.5),
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  '@container calendar (max-width: 600px)': {
    textAlign: 'center',
    fontSize: theme.typography.subtitle2.fontSize,
  },
}))

export const ActionGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),

  '@container calendar (max-width: 600px)': {
    justifyContent: 'center',
  },
}))

export const ViewToggle = styled(ToggleButtonGroup)(({ theme }) => ({
  '@container calendar (max-width: 600px)': {
    '& .MuiToggleButton-root': {
      paddingInline: theme.spacing(0.75),
      paddingBlock: theme.spacing(0.25),
      fontSize: theme.typography.caption.fontSize,
    },
  },
  '& .MuiToggleButton-root': {
    border: `1px solid ${theme.palette.divider}`,
    paddingInline: theme.spacing(1.75),
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
}))
