import api from '../../common/api/axios'
import type { AuthUser } from './auth.types'

export interface SignInResponse {
  // Our app JWT — replaces the external token in storage.
  token: string
  user: AuthUser
}

export const authService = {
  // Exchange the external IdP token for our own app JWT.
  signIn: (externalToken: string) =>
    api.post<SignInResponse>('/api/auth/sign-in', { token: externalToken }),

  // Validate the stored app JWT and get the current user (used to rehydrate
  // auth state on page load).
  me: () => api.get<AuthUser>('/api/auth/me'),
}
