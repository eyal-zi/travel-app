import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import type { Notification as NotificationData } from '../../hooks/useNotification'

type NotificationProps = {
  notification: NotificationData | null
  onClose: () => void
  // Override the severity-based default (errors linger longer than successes).
  autoHideDuration?: number
}

/**
 * Renders the single active notification from `useNotification` as a filled
 * bottom-center snackbar. Pair them: `const { notification, notifyError,
 * notifySuccess, close } = useNotification()` then
 * `<Notification notification={notification} onClose={close} />`.
 */
export const Notification = ({
  notification,
  onClose,
  autoHideDuration,
}: NotificationProps) => {
  const duration =
    autoHideDuration ?? (notification?.severity === 'error' ? 6000 : 4000)

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      {/* severity/message read from the last notification; they linger through
          the close animation, which is fine as the snackbar is sliding out. */}
      <Alert severity={notification?.severity} variant="filled" onClose={onClose}>
        {notification?.message}
      </Alert>
    </Snackbar>
  )
}
