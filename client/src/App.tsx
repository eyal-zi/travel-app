import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from './common/api/queryClient'
import router from './routes/routes'
import { ColorModeProvider } from './theme/ColorModeProvider'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <RouterProvider router={router} />
      </ColorModeProvider>
    </QueryClientProvider>
  )
}

export default App
