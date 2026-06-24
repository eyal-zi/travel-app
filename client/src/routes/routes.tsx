import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '../features/HomePae/HomePage'
import { RequestTripPage } from '../features/RequestTrip/RequestTripPage'
import { LargeFileRequestPage } from '../features/LargeFileRequest/LargeFileRequestPage'
import { AdminPage } from '../features/Admin/AdminPage'

const router = createBrowserRouter([
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
])

export default router
