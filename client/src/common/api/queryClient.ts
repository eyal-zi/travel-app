import { QueryClient } from '@tanstack/react-query'

// Single app-wide React Query client. Sensible defaults: don't refetch on every
// window focus, and retry failed requests once.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
