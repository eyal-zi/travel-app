import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { HomePage } from '../features/HomePage/HomePage'
import { RequestTripPage } from '../features/RequestTrip/RequestTripPage'
import { LargeFileRequestPage } from '../features/LargeFileRequest/LargeFileRequestPage'
import { RequestTripAdminPage } from '../features/RequestTrip/RequestTripAdminPage'
import { FileRequestAdminPage } from '../features/FileRequest/FileRequestAdminPage'
import { AuthGuard } from '../features/Auth/components/AuthGuard/AuthGuard'
import { RequireAdmin } from '../features/Auth/components/RequireAdmin/RequireAdmin'

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
      // Admin-only surfaces. A second pathless layout adds the RequireAdmin
      // guard on top of authentication, so non-admins are redirected home.
      // Admins land here from the home feature boxes (role-aware navigation).
      {
        element: (
          <RequireAdmin>
            <Outlet />
          </RequireAdmin>
        ),
        children: [
          {
            path: '/admin',
            element: <Navigate to="/admin/trip-requests" replace />,
          },
          {
            path: '/admin/trip-requests',
            element: <RequestTripAdminPage />,
          },
          {
            path: '/admin/file-requests',
            element: <FileRequestAdminPage />,
          },
        ],
      },
    ],
  },
])

export default router
