import type { ReactNode } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../context/AuthContext'
import { UnauthorizedPage } from '../UnauthorizedPage/UnauthorizedPage'
import { CenteredScreen, StatusStack } from './AuthGuard.styles'




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
