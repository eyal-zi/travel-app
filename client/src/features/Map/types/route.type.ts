import type { FeatureCollection } from 'geojson'





export interface Route {
  id: string
  name: string
  
  date: string
  data: FeatureCollection
  createdAt: string
  updatedAt: string
}


export interface RouteInput {
  name: string
  



  date: string
  data: FeatureCollection
}
