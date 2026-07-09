import Typography from '@mui/material/Typography'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import type { AdminPageShellProps } from './AdminPageShell.types'
import { HeaderText, PageHeader, PageRoot, Shell } from './AdminPageShell.styles'







export const AdminPageShell = ({
  title,
  subtitle,
  maxWidth,
  children,
}: AdminPageShellProps) => {
  return (
    <PageRoot>
      <Shell maxWidth={maxWidth}>
        <PageHeader>
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
