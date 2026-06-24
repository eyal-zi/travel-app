import { format, isValid } from 'date-fns'

// Wire format for date-keyed resources (routes, PDFs, weather) and date form
// fields. Keep every 'yyyy-MM-dd' literal flowing through here.
export const DATE_FMT = 'yyyy-MM-dd'

// Today as a 'yyyy-MM-dd' key — the default when no date is selected.
export const todayKey = (): string => format(new Date(), DATE_FMT)

// A Date as a 'yyyy-MM-dd' key, or '' when the date is missing or invalid.
export const serializeDate = (date: Date | null): string =>
  date && isValid(date) ? format(date, DATE_FMT) : ''
