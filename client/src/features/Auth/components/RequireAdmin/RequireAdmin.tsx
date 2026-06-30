import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import { isAdmin } from '../../roles'

// Guards admin-only routes. It renders inside the AuthGuard, so by the time it
// runs the user is already authenticated; non-admins are sent back to the home
// page. The server still enforces the role on every admin request — this guard
// only keeps the UI honest.
export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  if (!isAdmin(user)) return <Navigate to="/" replace />
  return <>{children}</>
}
