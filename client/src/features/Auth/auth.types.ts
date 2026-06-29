// The user profile carried by the JWT. The server is the source of truth; the
// client only decodes the token for display and routing decisions.
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

// The states the automatic auth flow can be in.
// - loading: rehydrating from storage / running the SSO flow
// - authenticated: valid token with the required group
// - unauthorized: could not authenticate, or signed in without the required
//   group (403) — shows the Unauthorized page
export type AuthStatus = 'loading' | 'authenticated' | 'unauthorized'

export interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  // Re-attempt the SSO flow (e.g. from the Unauthorized page).
  retry: () => void
}
