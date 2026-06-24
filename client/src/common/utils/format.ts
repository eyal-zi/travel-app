import { format, parseISO } from 'date-fns'

const KB = 1024
const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']

// Human-readable byte size, e.g. 1536 -> "1.5 KB", 5_000_000 -> "4.8 MB".
export const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return '0 B'
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(KB)),
    BYTE_UNITS.length - 1,
  )
  const value = bytes / KB ** exponent
  // Whole numbers for bytes and values >= 10; one decimal otherwise.
  const decimals = exponent === 0 || value >= 10 ? 0 : 1
  return `${value.toFixed(decimals)} ${BYTE_UNITS[exponent]}`
}

// An ISO date/timestamp as "dd MMM yyyy", falling back to the raw value when it
// can't be parsed.
export const formatDay = (value: string): string => {
  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? value : format(date, 'dd MMM yyyy')
}
