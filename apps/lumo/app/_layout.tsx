import { Stack } from 'expo-router'
import { QueryProvider } from 'shared'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n/i18n'

export default function Layout() {
  return (
    <QueryProvider>
      <I18nextProvider i18n={i18n}>
        <Stack />
      </I18nextProvider>
    </QueryProvider>
  )
}
