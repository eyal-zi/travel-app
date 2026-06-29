// Window events the axios response interceptor dispatches so the AuthProvider
// can react to auth failures from anywhere in the app without a hard reload.
export const AUTH_UNAUTHENTICATED_EVENT = 'auth:unauthenticated'
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized'
