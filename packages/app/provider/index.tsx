import * as React from 'react'
import { AuthProvider } from './auth-provider'
import { SafeArea } from './safe-area'
import { I18nProvider } from './i18n/i18n-provider'
import { APIProvider } from 'app/api-hooks/common/queryClient'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <APIProvider>
          <SafeArea>{children}</SafeArea>
        </APIProvider>
      </AuthProvider>
    </I18nProvider>
  )
}
