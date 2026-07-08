


import type { FeatureCollection } from 'geojson'
import type { SelectOption } from '../../common/types'
import type { RequestStatus } from '../../common/requests/requestStatus'
import type { LargeFileResult } from '../LargeFileRequest/types'

export type CreateFileRequest = {
  tripGoal: string
  country: string
  agency: string
  startDate: string 
  endDate: string 
  
  area: FeatureCollection
  
  fileTypes: string[]
  
  geo: string[]
  notes?: string 
}

export type FileRequestStatus = RequestStatus





export type RespondFileRequest = {
  name: string
  fileType: string
  accuracy: number
  country?: string
  coverageDate?: string 
  area: FeatureCollection
  status?: FileRequestStatus
  adminNote?: string
  fileKey: string
  fileName: string
}

export type FileRequest = CreateFileRequest & {
  id: string
  status: FileRequestStatus
  
  adminNote: string | null
  
  
  largeFile: LargeFileResult | null
  
  
  createdByUsername: string | null
  updatedByUsername: string | null
  createdAt: string
  updatedAt: string
}



export type FileRequestPage = {
  items: FileRequest[]
  nextCursor: string | null
}


export const GEO_OPTIONS: SelectOption[] = [
  { value: 'terrain', label: 'Terrain' },
  { value: 'urban', label: 'Urban' },
  { value: 'coastal', label: 'Coastal' },
]
