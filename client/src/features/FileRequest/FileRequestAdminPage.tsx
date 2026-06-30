import { AdminPageShell } from '../../common/components/AdminPageShell/AdminPageShell'
import { FileRequestsList } from './components/FileRequestsList/FileRequestsList'

/**
 * Admin surface for triaging file requests. Reuses the shared FileRequestsList
 * in `admin` mode so reviewers can filter by status, respond, and attach files.
 */
export const FileRequestAdminPage = () => (
  <AdminPageShell
    title="File request admin"
    subtitle="Review incoming file requests, respond and attach files."
  >
    <FileRequestsList admin />
  </AdminPageShell>
)
