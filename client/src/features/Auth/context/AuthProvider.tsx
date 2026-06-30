import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../services/authService'
import {
  AUTH_UNAUTHENTICATED_EVENT,
  AUTH_UNAUTHORIZED_EVENT,
} from '../utils/authEvents'
import type { AuthStatus, AuthUser } from '../auth.types'
import { decodeJwt } from '../utils/decodeJwt'
import { MOCK_EXTERNAL_TOKEN } from '../utils/mockExternalToken'
import { clearToken, getToken, setToken } from '../utils/tokenStorage'

// How long to wait for the SSO popup to post its message before giving up.
const SSO_TIMEOUT_MS = 30_000

// Reads the HTTP status off an unknown error (axios error or otherwise).
const statusOf = (error: unknown): number | undefined =>
  (error as { response?: { status?: number } })?.response?.status

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  // Guards against overlapping SSO attempts (popup already open).
  const authenticatingRef = useRef(false)

  // Runs the SSO popup flow: open the IdP, wait for its message, mock the
  // external token, exchange it for our app JWT, and swap it into storage.
  const runSsoFlow = useCallback(() => {
    if (authenticatingRef.current) return
    authenticatingRef.current = true
    setStatus('loading')

    const authUrl = import.meta.env.VITE_AUTH_URL
    const popup = window.open(authUrl, 'sso-login', 'width=480,height=640')

    let timeoutId: number

    const finish = (next: AuthStatus, nextUser: AuthUser | null = null) => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('message', handleMessage)
      popup?.close()
      authenticatingRef.current = false
      if (nextUser) setUser(nextUser)
      setStatus(next)
    }

    const handleMessage = async (event: MessageEvent) => {
      // Only trust messages coming from the IdP popup's origin.
      if (authUrl && event.origin !== new URL(authUrl).origin) return

      // MOCK: a real IdP sends `event.data.user.token`; for now we substitute a
      // hardcoded external token. TODO: read event.data.user.token instead.
      const externalToken = MOCK_EXTERNAL_TOKEN

      // The first token goes to storage, then we exchange it for our app JWT
      // and swap storage to the new one.
      setToken(externalToken)
      try {
        const { data } = await authService.signIn(externalToken)
        setToken(data.token)
        finish('authenticated', data.user)
      } catch (error) {
        if (statusOf(error) !== 403) clearToken()
        finish('unauthorized')
      }
    }

    timeoutId = window.setTimeout(() => finish('unauthorized'), SSO_TIMEOUT_MS)
    window.addEventListener('message', handleMessage)
  }, [])

  // On mount, rehydrate from a stored token; if that fails, start the SSO flow.
  useEffect(() => {
    let cancelled = false
    const token = getToken()
    if (!token) {
      runSsoFlow()
      return
    }
    setUser(decodeJwt(token))
    authService
      .me()
      .then(({ data }) => {
        if (cancelled) return
        setUser(data)
        setStatus('authenticated')
      })
      .catch((error) => {
        if (cancelled) return
        if (statusOf(error) === 403) {
          setStatus('unauthorized')
        } else {
          clearToken()
          setUser(null)
          runSsoFlow()
        }
      })
    return () => {
      cancelled = true
    }
  }, [runSsoFlow])

  // React to auth failures surfaced by the axios interceptor from anywhere.
  useEffect(() => {
    const onUnauthenticated = () => {
      setUser(null)
      runSsoFlow()
    }
    const onUnauthorized = () => setStatus('unauthorized')
    window.addEventListener(AUTH_UNAUTHENTICATED_EVENT, onUnauthenticated)
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
    return () => {
      window.removeEventListener(AUTH_UNAUTHENTICATED_EVENT, onUnauthenticated)
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized)
    }
  }, [runSsoFlow])

  const retry = useCallback(() => {
    clearToken()
    setUser(null)
    runSsoFlow()
  }, [runSsoFlow])

  const value = useMemo(
    () => ({ user, status, retry }),
    [user, status, retry],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
