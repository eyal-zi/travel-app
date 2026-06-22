// Trip request data model — mirrors the server DTO/schema in
// server/src/features/trip-requests. `status` and timestamps are set server-side.

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

export type TripRequest = CreateTripRequest & {
  id: string
  status: TripRequestStatus
  createdAt: string
  updatedAt: string
}

// A newest-first page of trip requests. `nextCursor` is the createdAt to pass
// back for the next (older) page, or null when there are no older items left.
export type TripRequestPage = {
  items: TripRequest[]
  nextCursor: string | null
}

type Option = { value: string; label: string }

export const TIME_DIVISION_OPTIONS: Option[] = [
  { value: 'hours', label: 'Hours' },
  { value: 'half-hours', label: 'Half hours' },
]

export const TIMEZONE_OPTIONS: Option[] = [
  { value: 'America/New_York', label: 'New York' },
  { value: 'Europe/Paris', label: 'Paris' },
]
