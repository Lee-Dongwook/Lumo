'use client'

import './(main)/globals.css'
import React from 'react'
import { I18nProvider } from 'app/provider/i18n/i18n-provider'
import QueryProvider from '@/components/providers/query-provider'

import { Bounce, ToastContainer } from 'react-toastify'
import { theme } from './context/ThemeProvider'
import { ThemeProvider } from '@mui/material'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <I18nProvider>
          <QueryProvider>
            <ThemeProvider theme={theme}>
              {children}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
              />
            </ThemeProvider>
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
