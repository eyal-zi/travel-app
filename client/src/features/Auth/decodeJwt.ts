import type { AuthUser } from './auth.types'

// Decode the (untrusted) payload of a JWT for display/routing only. The server
// verifies the signature on every request; we never rely on this for security.
// Returns null for malformed tokens.
export const decodeJwt = (token: string): AuthUser | null => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    // Convert base64url -> base64, then decode and parse.
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    )
    const claims = JSON.parse(json) as Partial<AuthUser> & { exp?: number }
    if (!claims.uniqueId) return null
    // Reject expired tokens so we don't show a stale session.
    if (claims.exp && claims.exp * 1000 < Date.now()) return null
    return {
      uniqueId: claims.uniqueId,
      username: claims.username ?? '',
      groups: claims.groups ?? [],
      firstName: claims.firstName ?? '',
      lastName: claims.lastName ?? '',
      fullName: claims.fullName ?? '',
      displayName: claims.displayName ?? '',
      email: claims.email ?? '',
      role: claims.role ?? 'user',
    }
  } catch {
    return null
  }
}
