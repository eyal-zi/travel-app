import type { ReactNode } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../AuthContext'
import { UnauthorizedPage } from '../UnauthorizedPage/UnauthorizedPage'
import { CenteredScreen, StatusStack } from './AuthGuard.styles'

// Wraps protected route content. Authentication runs automatically in the
// AuthProvider: while it's in flight we show a loading screen, on success we
// render the page, and on failure we render the Unauthorized page.
export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { status } = useAuth()

  if (status === 'authenticated') return <>{children}</>
  if (status === 'unauthorized') return <UnauthorizedPage />

  return (
    <CenteredScreen>
      <StatusStack>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Signing you in…
        </Typography>
      </StatusStack>
    </CenteredScreen>
  )
}
