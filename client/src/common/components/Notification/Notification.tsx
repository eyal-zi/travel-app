import Slide from '@mui/material/Slide'
import type { SlideProps } from '@mui/material/Slide'
import Snackbar from '@mui/material/Snackbar'
import type { AlertColor } from '@mui/material/Alert'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import type { Notification as NotificationData } from '../../hooks/useNotification'
import {
  AccentBar,
  Countdown,
  DismissButton,
  IconBadge,
  Message,
  Surface,
} from './Notification.styles'

type NotificationProps = {
  notification: NotificationData | null
  onClose: () => void
  // Override the severity-based default (errors linger longer than successes).
  autoHideDuration?: number
}

const ICONS: Record<AlertColor, typeof CheckCircleRoundedIcon> = {
  success: CheckCircleRoundedIcon,
  error: ErrorRoundedIcon,
  warning: WarningRoundedIcon,
  info: InfoRoundedIcon,
}

// Slide up from the bottom — feels lighter than the default grow.
const SlideUp = (props: SlideProps) => <Slide {...props} direction="up" />

/**
 * Renders the single active notification from `useNotification` as a clean,
 * modern bottom-center toast: a tinted severity glyph, the message, a subtle
 * close button, and a slim progress bar that depletes over the auto-hide
 * window. Pair them: `const { notification, notifyError, notifySuccess, close }
 * = useNotification()` then `<Notification notification={notification}
 * onClose={close} />`.
 */
export const Notification = ({
  notification,
  onClose,
  autoHideDuration,
}: NotificationProps) => {
  // severity/message linger through the slide-out animation, which is fine.
  const severity = notification?.severity ?? 'info'
  const duration = autoHideDuration ?? (severity === 'error' ? 6000 : 4000)
  const Icon = ICONS[severity]

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      slots={{ transition: SlideUp }}
    >
      <Surface elevation={0} role="alert">
        <AccentBar severity={severity} />

        <IconBadge severity={severity}>
          <Icon fontSize="small" />
        </IconBadge>

        <Message variant="body2">{notification?.message}</Message>

        <DismissButton
          aria-label="Dismiss notification"
          size="small"
          onClick={onClose}
        >
          <CloseRoundedIcon fontSize="small" />
        </DismissButton>

        {/* Remounts per message so the countdown restarts for each toast. */}
        <Countdown
          key={`${severity}:${notification?.message ?? ''}`}
          severity={severity}
          duration={duration}
        />
      </Surface>
    </Snackbar>
  )
}
