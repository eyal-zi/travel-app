import { createContext, useContext } from 'react'
import type { PaletteMode } from '@mui/material/styles'

export type ColorModeContextValue = {
  mode: PaletteMode
  toggleColorMode: () => void
  setMode: (mode: PaletteMode) => void
}

export const ColorModeContext = createContext<ColorModeContextValue | undefined>(
  undefined,
)


export const useColorMode = () => {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider')
  }
  return context
}
