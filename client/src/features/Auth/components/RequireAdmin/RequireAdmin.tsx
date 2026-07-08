import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { isAdmin } from '../../utils/roles'





export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  if (!isAdmin(user)) return <Navigate to="/" replace />
  return <>{children}</>
}
