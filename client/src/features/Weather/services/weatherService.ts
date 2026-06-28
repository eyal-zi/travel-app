import api from '../../../common/api/axios'
import { getOrNull } from '../../../common/api/getOrNull'

export type WeatherRecord = {
  id: string
  imageKey: string
  date: string
  signedUrl: string
}

// Weather images are uploaded as multipart/form-data: an "image" file part plus
// the "date" the image belongs to. axios infers the multipart Content-Type (and
// boundary) from the FormData body, so we don't set it ourselves.
export const weatherService = {
  // Returns the weather record for the date or the closest preceding one, or
  // null when there isn't one (the server answers 404 when nothing exists on or
  // before the date).
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

  // Soft-deletes the stored image for the date so the view falls back to the
  // closest preceding date's image (the row is kept, just flagged deleted).
  remove: (date: string) => api.delete('/api/weather', { params: { date } }),
}
