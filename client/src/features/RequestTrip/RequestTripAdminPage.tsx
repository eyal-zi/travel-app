import { AdminPageShell } from '../../common/components/AdminPageShell/AdminPageShell'
import { TripRequestsList } from './components/TripRequestsList/TripRequestsList'

/**
 * Admin surface for triaging trip requests. Reuses the shared TripRequestsList
 * in `admin` mode so reviewers can filter by status and move requests through
 * the workflow.
 */
export const RequestTripAdminPage = () => (
  <AdminPageShell
    title="Trip request admin"
    subtitle="Review incoming requests and update their status."
  >
    <TripRequestsList admin />
  </AdminPageShell>
)
