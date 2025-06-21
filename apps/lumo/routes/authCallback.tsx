import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { supabase } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUserStore } from '@/store/userStore'
import type { OAuthProvider } from '@/features/auth/api/signIn'

export default function AuthCallback() {
  const setUser = useUserStore((state) => state.setUser)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user
      const provider = await AsyncStorage.getItem('auth_provider')
      await AsyncStorage.removeItem('auth_provider')

      if (user && provider) {
        setUser({
          email: user.email!,
          name: user.user_metadata?.name ?? '',
          profileImageUrl: user.user_metadata?.avatar_url ?? '',
          supabaseUuid: user.id,
          authProvider: provider as OAuthProvider,
        })
        router.replace('/home')
      } else {
        router.replace('/login')
      }
    }
    init()
  }, [])

  return null
}
