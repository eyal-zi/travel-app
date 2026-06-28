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

/**
 * The single source of truth for icon markings. To add a new icon, add a key to
 * the `EventIconMarking` union and its icon component here — the dialog picker,
 * the event rendering, and styling all derive from this map. The `Record` type
 * makes a missing entry a compile error.
 */
export const EVENT_ICON_MARKINGS: Record<EventIconMarking, SvgIconComponent> = {
  moon: DarkModeRoundedIcon,
}

const ICON_MARKINGS = Object.keys(EVENT_ICON_MARKINGS) as EventIconMarking[]

/** All marking options shown in the dialog, in display order: colours then icons. */
export const EVENT_STYLE_OPTIONS: EventStyle[] = [...EVENT_COLORS, ...ICON_MARKINGS]

export const isIconMarking = (style: EventStyle): style is EventIconMarking =>
  (ICON_MARKINGS as string[]).includes(style)

export const isColorStyle = (style: EventStyle): style is EventColor => !isIconMarking(style)

/** The icon component for a marking, or `null` for a plain colour style. */
export const getMarkingIcon = (style: EventStyle): SvgIconComponent | null =>
  isIconMarking(style) ? EVENT_ICON_MARKINGS[style] : null

export interface EventAppearance {
  backgroundColor: string
  borderColor: string
  textColor: string
}

/**
 * Resolves a marking style into FullCalendar colours for the active theme.
 * Colours map to their palette; icon markings render as a muted, neutral event
 * (the icon itself is what distinguishes them — see {@link getMarkingIcon}).
 */
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
