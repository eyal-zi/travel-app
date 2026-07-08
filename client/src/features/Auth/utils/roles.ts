import type { AuthUser } from '../auth.types'




export const isAdmin = (user: AuthUser | null): boolean => user?.role === 'admin'
