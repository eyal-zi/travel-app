import { format, isValid } from 'date-fns'



export const DATE_FMT = 'yyyy-MM-dd'


export const todayKey = (): string => format(new Date(), DATE_FMT)


export const serializeDate = (date: Date | null): string =>
  date && isValid(date) ? format(date, DATE_FMT) : ''
