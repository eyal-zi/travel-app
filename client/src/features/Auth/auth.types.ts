

export interface AuthUser {
  uniqueId: string
  username: string
  groups: string[]
  firstName: string
  lastName: string
  fullName: string
  displayName: string
  email: string
  role: 'user' | 'admin'
}






export type AuthStatus = 'loading' | 'authenticated' | 'unauthorized'

export interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  
  retry: () => void
}
