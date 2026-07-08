import { format, parseISO } from 'date-fns'

const KB = 1024
const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB']


export const formatBytes = (bytes: number): string => {
  if (bytes <= 0) return '0 B'
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(KB)),
    BYTE_UNITS.length - 1,
  )
  const value = bytes / KB ** exponent
  
  const decimals = exponent === 0 || value >= 10 ? 0 : 1
  return `${value.toFixed(decimals)} ${BYTE_UNITS[exponent]}`
}



export const formatDay = (value: string): string => {
  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? value : format(date, 'dd MMM yyyy')
}
