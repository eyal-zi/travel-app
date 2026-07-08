import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import { useNavigate } from 'react-router-dom'
import type { AdminPageShellProps } from './AdminPageShell.types'
import { HeaderText, PageHeader, PageRoot, Shell } from './AdminPageShell.styles'







export const AdminPageShell = ({
  title,
  subtitle,
  maxWidth,
  children,
}: AdminPageShellProps) => {
  const navigate = useNavigate()

  return (
    <PageRoot>
      <Shell maxWidth={maxWidth}>
        <PageHeader>
          <IconButton
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back to home"
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <AdminPanelSettingsRoundedIcon color="primary" />
          <HeaderText>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </HeaderText>
        </PageHeader>

        {children}
      </Shell>
    </PageRoot>
  )
}
