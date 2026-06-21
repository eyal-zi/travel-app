import { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import { IconBadge, WeatherButton, WeatherLabel } from './WeatherWidget.styles'
import { WeatherModal } from './WeatherModal/WeatherModal'

export const WeatherWidget = () => {
  const [open, setOpen] = useState(false)
  const [seed, setSeed] = useState(0)

  const handleOpen = () => {
    setSeed(Date.now())
    setOpen(true)
  }

  return (
    <>
      <Tooltip title="Weather">
        <WeatherButton onClick={handleOpen} aria-label="Open weather">
          <IconBadge>
            <WbSunnyRoundedIcon />
          </IconBadge>
          <WeatherLabel>Weather</WeatherLabel>
        </WeatherButton>
      </Tooltip>

      <WeatherModal open={open} seed={seed} onClose={() => setOpen(false)} />
    </>
  )
}
