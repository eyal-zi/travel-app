import Tooltip from '@mui/material/Tooltip'
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded'
import { useSearchParamState } from '../../common/hooks/useSearchParamState'
import { IconBadge, WeatherButton, WeatherLabel } from './WeatherWidget.styles'
import { WeatherModal } from './WeatherModal/WeatherModal'

export const WeatherWidget = () => {
  // The `weather` param makes the modal deep-linkable. Opening pushes a history
  // entry (Back closes it); closing replaces, leaving no stray entry.
  const [weather, setWeather] = useSearchParamState('weather')
  const open = weather === 'open'

  return (
    <>
      <Tooltip title="Weather">
        <WeatherButton
          onClick={() => setWeather('open', { replace: false })}
          aria-label="Open weather"
        >
          <IconBadge>
            <WbSunnyRoundedIcon />
          </IconBadge>
          <WeatherLabel>Weather</WeatherLabel>
        </WeatherButton>
      </Tooltip>

      <WeatherModal open={open} onClose={() => setWeather(null)} />
    </>
  )
}
