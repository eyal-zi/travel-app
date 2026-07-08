


import type { SelectOption } from '../../common/types'

export type CreateTripRequest = {
  tripGoal: string
  country: string
  startDate: string 
  endDate: string 
  timezone: string
  landmark: string
  timeDivision: string
  notes?: string 
}


export const TRIP_REQUEST_STATUSES = ['received', 'processing', 'done'] as const

export type TripRequestStatus = (typeof TRIP_REQUEST_STATUSES)[number]


export type TripRequestFile = {
  id: string
  fileName: string
  contentType: string
  signedUrl: string
}

export type TripRequest = CreateTripRequest & {
  id: string
  status: TripRequestStatus
  
  adminNote: string | null
  files: TripRequestFile[]
  
  
  createdByUsername: string | null
  updatedByUsername: string | null
  createdAt: string
  updatedAt: string
}



export type TripRequestPage = {
  items: TripRequest[]
  nextCursor: string | null
}

export const TIME_DIVISION_OPTIONS: SelectOption[] = [
  { value: 'hours', label: 'Hours' },
  { value: 'half-hours', label: 'Half hours' },
]

export const TIMEZONE_OPTIONS: SelectOption[] = [
  { value: 'America/New_York', label: 'New York' },
  { value: 'Europe/Paris', label: 'Paris' },
]
