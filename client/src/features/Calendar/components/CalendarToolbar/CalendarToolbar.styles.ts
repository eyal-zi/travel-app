import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

/** Top bar: navigation on the left, view switcher + add on the right. */
export const ToolbarRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  paddingBlock: theme.spacing(1.5),
  // Push the right-hand cluster away from the navigation cluster.
  '& > :last-child': {
    marginInlineStart: 'auto',
  },

  // When the calendar itself is narrow, stack the groups into centered rows
  // (full labels kept) instead of crowding them onto one wrapping line.
  '@container calendar (max-width: 600px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1),
    '& > :last-child': {
      marginInlineStart: 0,
    },
    // Keep the selected-date chip compact rather than stretched full-width.
    '& > .MuiChip-root': {
      alignSelf: 'center',
    },
    // Shrink the buttons (Today / Add event) so they fit a narrow toolbar.
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
    // Smaller nav arrows.
    '& .MuiIconButton-root': {
      padding: theme.spacing(0.5),
    },
  },
}))

/** Prev / today / next navigation group. */
export const NavGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),

  '@container calendar (max-width: 600px)': {
    justifyContent: 'center',
  },
}))

/** The current period label; truncates gracefully when space is tight. */
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

/** Right-hand cluster: view toggle + add button. */
export const ActionGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1.5),

  '@container calendar (max-width: 600px)': {
    justifyContent: 'center',
  },
}))

/** Pill-shaped, theme-coloured view switcher. */
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
