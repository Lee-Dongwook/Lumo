'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

const ErrorPage = () => {
  const router = useRouter()
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <button
        onClick={() => router.push('/auth')}
        className="bg-black p-2 px-4 text-white"
      >
        Back to Login Page
      </button>
    </div>
  )
}

export default ErrorPage
