import { RouterProvider } from 'react-router-dom'
import router from './routes/routes'
import { ColorModeProvider } from './theme/ColorModeProvider'

const App = () => {
  return (
    <ColorModeProvider>
      <RouterProvider router={router} />
    </ColorModeProvider>
  )
}

export default App
