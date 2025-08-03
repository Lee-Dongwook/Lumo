import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'

import { AuthProvider } from '@/entities/user'

export type OAuthProvider = AuthProvider

export const handleOAuthLogin = async (provider: OAuthProvider) => {
  const redirectTo = Linking.createURL('/auth/callback')

  await AsyncStorage.setItem('auth_provider', provider)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  })

  if (error) {
    console.error('OAuth error:', error.message)
    return
  }

  if (data?.url) {
    await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
  }
}
