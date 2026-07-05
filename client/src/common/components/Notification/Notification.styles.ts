import { alpha, styled } from '@mui/material/styles'
import type { AlertColor } from '@mui/material/Alert'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

// `severity` selects the accent color; it's consumed here, not forwarded to the DOM.
const consumeSeverity = { shouldForwardProp: (prop: string) => prop !== 'severity' }

export const Surface = styled(Paper)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  minWidth: 320,
  maxWidth: 440,
  padding: theme.spacing(1.5, 1, 1.5, 1.75),
  overflow: 'hidden',
  borderRadius: 14,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === 'light'
      ? '0 10px 30px -12px rgba(15, 23, 42, 0.28), 0 4px 8px -6px rgba(15, 23, 42, 0.16)'
      : '0 12px 34px -12px rgba(0, 0, 0, 0.7)',
}))

// Severity accent bar down the leading edge.
export const AccentBar = styled(Box, consumeSeverity)<{ severity: AlertColor }>(
  ({ theme, severity }) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.palette[severity].main,
  }),
)

// Tinted circular glyph badge.
export const IconBadge = styled(Box, consumeSeverity)<{ severity: AlertColor }>(
  ({ theme, severity }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 34,
    height: 34,
    borderRadius: '50%',
    color: theme.palette[severity].main,
    backgroundColor: alpha(theme.palette[severity].main, 0.14),
  }),
)

export const Message = styled(Typography)(({ theme }) => ({
  flex: 1,
  paddingRight: theme.spacing(0.5),
  fontWeight: theme.typography.fontWeightMedium,
  color: theme.palette.text.primary,
  wordBreak: 'break-word',
}))

export const DismissButton = styled(IconButton)(({ theme }) => ({
  flexShrink: 0,
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
  },
}))

// Slim countdown bar; remounts per message (via `key`) so it restarts each toast.
export const Countdown = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'severity' && prop !== 'duration',
})<{ severity: AlertColor; duration: number }>(({ theme, severity, duration }) => ({
  position: 'absolute',
  left: 0,
  bottom: 0,
  height: 3,
  width: '100%',
  opacity: 0.5,
  transformOrigin: 'left',
  backgroundColor: theme.palette[severity].main,
  animation: `notification-countdown ${duration}ms linear forwards`,
  '@keyframes notification-countdown': {
    from: { transform: 'scaleX(1)' },
    to: { transform: 'scaleX(0)' },
  },
}))
