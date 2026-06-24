// Trip request data model — mirrors the server DTO/schema in
// server/src/features/trip-requests. `status` and timestamps are set server-side.

import type { SelectOption } from '../../common/types'

export type CreateTripRequest = {
  tripGoal: string
  country: string
  startDate: string // 'YYYY-MM-DD'
  endDate: string // 'YYYY-MM-DD'
  timezone: string
  landmark: string
  timeDivision: string
  notes?: string // optional
}

// Workflow statuses, in order. Mirrors TRIP_REQUEST_STATUSES on the server.
export const TRIP_REQUEST_STATUSES = ['received', 'processing', 'done'] as const

export type TripRequestStatus = (typeof TRIP_REQUEST_STATUSES)[number]

// A file the admin attached to a request, with a short-lived URL to download it.
export type TripRequestFile = {
  id: string
  fileName: string
  contentType: string
  signedUrl: string
}

export type TripRequest = CreateTripRequest & {
  id: string
  status: TripRequestStatus
  // Admin's free-form response, or null until one is written.
  adminNote: string | null
  files: TripRequestFile[]
  createdAt: string
  updatedAt: string
}

// A newest-first page of trip requests. `nextCursor` is the createdAt to pass
// back for the next (older) page, or null when there are no older items left.
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
