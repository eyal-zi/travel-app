import type { AuthUser } from './auth.types'

// Single source of truth for the admin-role check, shared by the RequireAdmin
// route guard and role-aware UI (e.g. the home-page feature boxes). The server
// is authoritative; this only drives client routing/UI decisions.
export const isAdmin = (user: AuthUser | null): boolean => user?.role === 'admin'
