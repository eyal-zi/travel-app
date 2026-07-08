import { alpha } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import type { SvgIconComponent } from '@mui/icons-material'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import type { EventColor, EventIconMarking, EventStyle } from './Calendar.types'

const EVENT_COLORS: EventColor[] = [
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'info',
]







export const EVENT_ICON_MARKINGS: Record<EventIconMarking, SvgIconComponent> = {
  moon: DarkModeRoundedIcon,
}

const ICON_MARKINGS = Object.keys(EVENT_ICON_MARKINGS) as EventIconMarking[]


export const EVENT_STYLE_OPTIONS: EventStyle[] = [...EVENT_COLORS, ...ICON_MARKINGS]

export const isIconMarking = (style: EventStyle): style is EventIconMarking =>
  (ICON_MARKINGS as string[]).includes(style)

export const isColorStyle = (style: EventStyle): style is EventColor => !isIconMarking(style)


export const getMarkingIcon = (style: EventStyle): SvgIconComponent | null =>
  isIconMarking(style) ? EVENT_ICON_MARKINGS[style] : null

export interface EventAppearance {
  backgroundColor: string
  borderColor: string
  textColor: string
}






export const resolveEventAppearance = (
  theme: Theme,
  style: EventStyle = 'primary',
): EventAppearance => {
  if (isColorStyle(style)) {
    const palette = theme.palette[style]
    return {
      backgroundColor: palette.main,
      borderColor: palette.main,
      textColor: palette.contrastText,
    }
  }
  return {
    backgroundColor: alpha(theme.palette.text.primary, 0.08),
    borderColor: alpha(theme.palette.text.primary, 0.24),
    textColor: theme.palette.text.primary,
  }
}
