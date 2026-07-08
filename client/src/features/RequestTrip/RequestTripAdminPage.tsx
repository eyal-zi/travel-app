import { AdminPageShell } from '../../common/components/AdminPageShell/AdminPageShell'
import { TripRequestsList } from './components/TripRequestsList/TripRequestsList'






export const RequestTripAdminPage = () => (
  <AdminPageShell
    title="Trip request admin"
    subtitle="Review incoming requests and update their status."
  >
    <TripRequestsList admin />
  </AdminPageShell>
)
