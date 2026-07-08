import api from '../../../common/api/axios'
import type { AuthUser } from '../auth.types'

export interface SignInResponse {
  
  token: string
  user: AuthUser
}

export const authService = {
  
  signIn: (externalToken: string) =>
    api.post<SignInResponse>('/api/auth/sign-in', { token: externalToken }),

  
  
  me: () => api.get<AuthUser>('/api/auth/me'),
}
