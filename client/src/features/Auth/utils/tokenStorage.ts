// Single source of truth for the JWT in localStorage. The same `jwt` key holds
// first the external IdP token and then, after sign-in, our app token.
const TOKEN_KEY = 'jwt'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string): void =>
  localStorage.setItem(TOKEN_KEY, token)

export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY)
