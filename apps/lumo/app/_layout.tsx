import { Stack, useRouter } from 'expo-router'
import { useUserStore } from '@/store/userStore'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RootLayout() {
  const { isLoggedIn, setUser } = useUserStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 앱 시작 시 세션 검사
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      if (user) {
        setUser({
          email: user.email!,
          name: user.user_metadata?.name,
          profileImageUrl: user.user_metadata?.avatar_url,
          supabaseUuid: user.id,
          authProvider: 'google',
        })
        router.replace('/home')
      } else {
        router.replace('/login')
      }
      setLoading(false)
    }

    checkSession()
  }, [])

  if (loading) return null

  return <Stack />
}
