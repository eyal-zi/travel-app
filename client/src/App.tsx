import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from './common/api/queryClient'
import router from './routes/routes'
import { ColorModeProvider } from './theme/ColorModeProvider'
import { AuthProvider } from './features/Auth/AuthProvider'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ColorModeProvider>
    </QueryClientProvider>
  )
}

export default App
