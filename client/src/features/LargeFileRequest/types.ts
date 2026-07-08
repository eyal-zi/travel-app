



import type { FeatureCollection, Geometry } from 'geojson'



export {
  LARGE_FILE_TYPE_OPTIONS,
  OTHER_FILE_TYPE,
} from '../../common/constants/fileTypes'


export const ACCURACY_MIN = 0
export const ACCURACY_MAX = 15



export type LargeFileSearch = {
  fileTypes?: string[]
  accuracy?: number
  
  country?: string
  
  startDate?: string
  endDate?: string
  area?: FeatureCollection
  cursor?: string
  limit?: number
}


export type LargeFileResult = {
  id: string
  name: string
  fileType: string
  accuracy: number
  
  country: string | null
  
  coverageDate: string | null
  sizeBytes: number
  geometry: Geometry
  createdAt: string
}



export type LargeFilePage = {
  items: LargeFileResult[]
  nextCursor: string | null
}
