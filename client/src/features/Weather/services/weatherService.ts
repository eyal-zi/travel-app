import api from '../../../common/api/axios'
import { getOrNull } from '../../../common/api/getOrNull'

export type WeatherRecord = {
  id: string
  imageKey: string
  date: string
  signedUrl: string
}




export const weatherService = {
  
  
  
  getClosest: (date: string) =>
    getOrNull(
      api.get<WeatherRecord>('/api/weather/closest', { params: { date } }),
    ),

  create: (date: string, image: File) => {
    const form = new FormData()
    form.append('image', image)
    form.append('date', date)
    return api.post<WeatherRecord>('/api/weather', form)
  },

  
  
  remove: (date: string) => api.delete('/api/weather', { params: { date } }),
}
