import { useAuth } from '../context/AuthContext'
import { isAdmin } from '../utils/roles'



export const useIsAdmin = (): boolean => isAdmin(useAuth().user)
