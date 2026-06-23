import axios from 'axios'
import api from '../../common/api/axios'

export type PdfRecord = {
  id: string
  fileKey: string
  date: string
  signedUrl: string
}

// PDFs are uploaded as multipart/form-data: a "file" part plus the "date" the
// PDF belongs to. axios infers the multipart Content-Type (and boundary) from
// the FormData body, so we don't set it ourselves.
export const pdfService = {
  // Returns the PDF for the date or the closest preceding one, or null when
  // there isn't one (the server answers 404 when nothing exists on or before
  // the date).
  getClosest: async (date: string): Promise<PdfRecord | null> => {
    try {
      const { data } = await api.get<PdfRecord>('/api/pdf/closest', {
        params: { date },
      })
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  create: (date: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    form.append('date', date)
    return api.post<PdfRecord>('/api/pdf', form)
  },

  // Soft-deletes the PDF for the date so the view falls back to the closest
  // preceding date's PDF (the row is kept, just flagged deleted).
  removeByDate: (date: string) => api.delete('/api/pdf', { params: { date } }),
}
