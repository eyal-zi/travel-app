import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import { useColorMode } from './ColorModeProvider'

/** Icon button that toggles the app between dark and light mode. */
export const ColorModeToggle = () => {
  const { mode, toggleColorMode } = useColorMode()
  const isDark = mode === 'dark'
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <Tooltip title={label}>
      <IconButton onClick={toggleColorMode} aria-label={label} color="inherit">
        {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  )
}
