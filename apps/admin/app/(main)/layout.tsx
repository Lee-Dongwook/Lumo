import React from 'react'
import { createAuthClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import './common.scss'
import axiosInstance from '@/utils/axios/axiosInstance'
import { Metadata } from 'next'
// import GlobalSidebar from '@/components/sidebar'
// import ClientAccessToken from '@/components/client-access-token'

export const metadata: Metadata = {
  title: 'Lumo',
}

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createAuthClient()

  const { data, error } = await supabase.auth.getUser()

  const accessToken = (await supabase.auth.getSession()).data.session
    ?.access_token
  if (error || !data?.user) {
    redirect('/auth')
  }

  axiosInstance.defaults.headers.common['Authorization'] =
    `Bearer ${accessToken}`

  return (
    <>
      {/* <ClientAccessToken accessToken={accessToken as string} /> */}
      <>{children}</>
    </>
  )
}

export default DashboardLayout
