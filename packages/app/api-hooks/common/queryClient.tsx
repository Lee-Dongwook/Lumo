import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 300000, // 5분
    },
  },
})

export function APIProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
