import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import type { PaletteMode } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'
import { createAppTheme } from './theme'

type ColorModeContextValue = {
  mode: PaletteMode
  toggleColorMode: () => void
  setMode: (mode: PaletteMode) => void
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined)

const STORAGE_KEY = 'travel-app-color-mode'

const getInitialMode = (prefersDark: boolean): PaletteMode => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  }
  return prefersDark ? 'dark' : 'light'
}

export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = useState<PaletteMode>(() => getInitialMode(prefersDark))

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      setMode,
      toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  )

  const theme = useMemo(() => createAppTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

/** Access the current color mode and toggle helpers. */
export const useColorMode = () => {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider')
  }
  return context
}
