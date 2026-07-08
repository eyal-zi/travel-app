import api from '../../../common/api/axios'
import { getOrNull } from '../../../common/api/getOrNull'

export type PdfRecord = {
  id: string
  fileKey: string
  date: string
  signedUrl: string
}




export const pdfService = {
  
  
  
  getClosest: (date: string) =>
    getOrNull(api.get<PdfRecord>('/api/pdf/closest', { params: { date } })),

  create: (date: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    form.append('date', date)
    return api.post<PdfRecord>('/api/pdf', form)
  },

  
  
  removeByDate: (date: string) => api.delete('/api/pdf', { params: { date } }),
}
