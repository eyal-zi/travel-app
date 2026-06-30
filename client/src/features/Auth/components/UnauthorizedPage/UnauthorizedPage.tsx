import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import { useAuth } from '../../context/AuthContext'
import {
  Card,
  CardStack,
  IconWrap,
  PageRoot,
} from './UnauthorizedPage.styles'

// Shown when authentication couldn't complete, or the user lacks the required
// group (server 403). "Try again" re-runs the SSO flow.
export const UnauthorizedPage = () => {
  const { retry } = useAuth()

  return (
    <PageRoot>
      <Card elevation={3}>
        <CardStack>
          <IconWrap>
            <BlockRoundedIcon />
          </IconWrap>
          <Stack spacing={1}>
            <Typography variant="h5">Access denied</Typography>
            <Typography variant="body2" color="text.secondary">
              Your account doesn&apos;t have permission to use this application.
              Contact an administrator if you believe this is a mistake.
            </Typography>
          </Stack>
          <Button variant="outlined" onClick={retry} fullWidth>
            Try again
          </Button>
        </CardStack>
      </Card>
    </PageRoot>
  )
}
