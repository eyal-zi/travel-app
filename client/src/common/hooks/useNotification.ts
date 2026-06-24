import { useState } from 'react'
import type { AlertColor } from '@mui/material/Alert'

export type Notification = {
  severity: AlertColor
  message: string
}

/**
 * Single-slot transient notification (success/error) for the shared
 * `Notification` snackbar. Success and error are mutually exclusive per surface,
 * so one slot replaces the duplicated error+success Snackbar pairs that used to
 * live in each component.
 */
export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null)

  const notifyError = (message: string) =>
    setNotification({ severity: 'error', message })

  const notifySuccess = (message: string) =>
    setNotification({ severity: 'success', message })

  const close = () => setNotification(null)

  return { notification, notifyError, notifySuccess, close }
}
