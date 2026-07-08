import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pdfService, type PdfRecord } from '../services/pdfService'



export const pdfKey = (date: string) => ['pdf', date] as const


export const usePdfForDate = (date: string) =>
  useQuery({
    queryKey: pdfKey(date),
    queryFn: () => pdfService.getClosest(date),
  })

export const useSavePdf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ date, file }: { date: string; file: File }) =>
      pdfService.create(date, file).then((res) => res.data),
    onSuccess: (record, { date }) => {
      queryClient.setQueryData<PdfRecord | null>(pdfKey(date), record)
    },
  })
}

export const useDeletePdf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (date: string) => pdfService.removeByDate(date),
    
    
    onSuccess: (_data, date) => {
      queryClient.setQueryData<PdfRecord | null>(pdfKey(date), null)
    },
  })
}
