// File request data model — mirrors the server DTO/schema in
// server/src/features/file-requests. `status` and timestamps are set server-side.

import type { FeatureCollection } from 'geojson'
import type { SelectOption } from '../../common/types'
import type { RequestStatus } from '../../common/requests/requestStatus'
import type { LargeFileResult } from '../LargeFileRequest/types'

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

// Admin "respond" payload: the large-file metadata plus a reference to the object
// the admin already uploaded straight to S3 (`fileKey` + original `fileName`), and
// the workflow status/note. Sent as JSON — the file itself never goes through the
// API. `status` defaults to "done" server-side when omitted.
export type RespondFileRequest = {
  name: string
  fileType: string
  accuracy: number
  country?: string
  coverageDate?: string // 'YYYY-MM-DD'
  area: FeatureCollection
  status?: FileRequestStatus
  adminNote?: string
  fileKey: string
  fileName: string
}

export type FileRequest = CreateFileRequest & {
  id: string
  status: FileRequestStatus
  // Admin's free-form response, or null until one is written.
  adminNote: string | null
  // The large file created to fulfil this request, rendered to the requester as a
  // search-style card. Null until an admin responds.
  largeFile: LargeFileResult | null
  // Username of the requester (shown to admins) and of the admin who last updated
  // the request (shown to the requester). Null until set / user unknown.
  createdByUsername: string | null
  updatedByUsername: string | null
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
