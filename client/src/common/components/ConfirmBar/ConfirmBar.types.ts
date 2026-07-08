import type { ReactNode } from 'react'



type ActionColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'



export type ConfirmBarProps = {


  onAction: () => void


  onCancel: () => void


  busy?: boolean


  disabled?: boolean


  actionLabel?: string


  busyLabel?: string


  cancelLabel?: string


  actionIcon?: ReactNode


  cancelIcon?: ReactNode


  actionColor?: ActionColor


  placement?: 'top' | 'bottom'


  zIndex?: number
}
