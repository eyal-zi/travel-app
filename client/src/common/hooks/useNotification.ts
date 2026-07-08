import { useState } from 'react'
import type { AlertColor } from '@mui/material/Alert'

export type Notification = {
  severity: AlertColor
  message: string
}







export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null)

  const notifyError = (message: string) =>
    setNotification({ severity: 'error', message })

  const notifySuccess = (message: string) =>
    setNotification({ severity: 'success', message })

  const close = () => setNotification(null)

  return { notification, notifyError, notifySuccess, close }
}
