import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pdfService, type PdfRecord } from '../services/pdfService'

// Per-date key. The PDF for a date is a singleton: the one stored on that date,
// or the closest preceding one.
export const pdfKey = (date: string) => ['pdf', date] as const

/** The PDF record for the date (or closest preceding), or null when none. */
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
    // Drop straight to the empty state rather than falling back to the closest
    // preceding PDF, matching the previous behavior.
    onSuccess: (_data, date) => {
      queryClient.setQueryData<PdfRecord | null>(pdfKey(date), null)
    },
  })
}
