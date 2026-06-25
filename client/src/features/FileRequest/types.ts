// File request data model — mirrors the server DTO/schema in
// server/src/features/file-requests. `status` and timestamps are set server-side.

import type { FeatureCollection } from 'geojson'
import type { SelectOption } from '../../common/types'
import type { RequestStatus } from '../../common/requests/requestStatus'

export type CreateFileRequest = {
  tripGoal: string
  country: string
  agency: string
  startDate: string // 'YYYY-MM-DD'
  endDate: string // 'YYYY-MM-DD'
  // Area of interest drawn on the map.
  area: FeatureCollection
  // Requested file types (fixed values and/or free-text "other" entries).
  fileTypes: string[]
  // Selected geo tags (terrain/urban/coastal).
  geo: string[]
  notes?: string // optional
}

export type FileRequestStatus = RequestStatus

// A file the admin attached to a request, with a short-lived URL to download it.
export type FileRequestFile = {
  id: string
  fileName: string
  contentType: string
  signedUrl: string
}

export type FileRequest = CreateFileRequest & {
  id: string
  status: FileRequestStatus
  // Admin's free-form response, or null until one is written.
  adminNote: string | null
  files: FileRequestFile[]
  createdAt: string
  updatedAt: string
}

// A newest-first page of file requests. `nextCursor` is the createdAt to pass
// back for the next (older) page, or null when there are no older items left.
export type FileRequestPage = {
  items: FileRequest[]
  nextCursor: string | null
}

// The three geo tags offered by the request form.
export const GEO_OPTIONS: SelectOption[] = [
  { value: 'terrain', label: 'Terrain' },
  { value: 'urban', label: 'Urban' },
  { value: 'coastal', label: 'Coastal' },
]
