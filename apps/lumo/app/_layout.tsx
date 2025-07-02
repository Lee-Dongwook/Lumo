import { Stack } from 'expo-router'
import { QueryProvider } from 'shared'

export default function Layout() {
  return (
    <QueryProvider>
      <Stack />
    </QueryProvider>
  )
}
