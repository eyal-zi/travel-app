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
  // Returns the stored weather record for the date, or null when there isn't
  // one yet (the server answers 404 for dates without an image).
  getByDate: (date: string) =>
    getOrNull(api.get<WeatherRecord>('/api/weather', { params: { date } })),

  create: (date: string, image: File) => {
    const form = new FormData()
    form.append('image', image)
    form.append('date', date)
    return api.post<WeatherRecord>('/api/weather', form)
  },

  // Soft-deletes the stored image for the date on the server (the row is kept,
  // just flagged deleted, so it stays recoverable).
  remove: (date: string) => api.delete('/api/weather', { params: { date } }),
}
