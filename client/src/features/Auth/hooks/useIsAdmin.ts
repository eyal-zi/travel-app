import { useAuth } from '../context/AuthContext'
import { isAdmin } from '../utils/roles'

// Convenience wrapper around `useAuth` + `isAdmin` for the widgets that only
// need to know whether the current user may mutate (admins) or just watch.
export const useIsAdmin = (): boolean => isAdmin(useAuth().user)
