import { createBrowserRouter, Outlet } from 'react-router-dom'
import { HomePage } from '../features/HomePage/HomePage'
import { RequestTripPage } from '../features/RequestTrip/RequestTripPage'
import { LargeFileRequestPage } from '../features/LargeFileRequest/LargeFileRequestPage'
import { AdminPage } from '../features/Admin/AdminPage'
import { FileRequestAdminPage } from '../features/Admin/FileRequestAdminPage'
import { AuthGuard } from '../features/Auth/components/AuthGuard/AuthGuard'

// A pathless layout route wrapping the whole app in the AuthGuard: every route
// nested under it is authenticated automatically, so new routes are protected
// by default without per-route wiring.
const router = createBrowserRouter([
  {
    element: (
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/request-trip',
        element: <RequestTripPage />,
      },
      {
        path: '/large-file-request',
        element: <LargeFileRequestPage />,
      },
      // Unlinked admin surface for triaging trip requests.
      {
        path: '/admin',
        element: <AdminPage />,
      },
      // Unlinked admin surface for triaging file requests.
      {
        path: '/admin/file-requests',
        element: <FileRequestAdminPage />,
      },
    ],
  },
])

export default router
