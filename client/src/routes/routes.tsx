import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { HomePage } from '../features/HomePage/HomePage'
import { RequestTripPage } from '../features/RequestTrip/RequestTripPage'
import { LargeFileRequestPage } from '../features/LargeFileRequest/LargeFileRequestPage'
import { RequestTripAdminPage } from '../features/RequestTrip/RequestTripAdminPage'
import { FileRequestAdminPage } from '../features/FileRequest/FileRequestAdminPage'
import { AuthGuard } from '../features/Auth/components/AuthGuard/AuthGuard'
import { RequireAdmin } from '../features/Auth/components/RequireAdmin/RequireAdmin'




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
      
      
      
      {
        element: (
          <RequireAdmin>
            <Outlet />
          </RequireAdmin>
        ),
        children: [
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
