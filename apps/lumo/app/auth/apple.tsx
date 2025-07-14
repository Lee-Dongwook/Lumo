import { View, Button } from 'react-native'
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from '@/lib/supabase'
import { asyncAuthStorage } from '@/utils/auth'

export default function AppleLoginScreen() {
  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      const identityToken = credential.identityToken

      if (!identityToken) {
        return {
          success: false,
          error: {
            code: 'NO_IDENTITY_TOKEN',
            message: 'No identityToken received from Apple',
          },
        }
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: identityToken,
      })

      if (data.session) {
        await asyncAuthStorage.setSession(data.session)
      }

      if (error) {
        return {
          success: false,
          error: {
            code: 'SUPABASE_ERROR',
            message: error.message,
          },
        }
      }

      const user = data.user
      const isFirstLogin =
        user.created_at === user.last_sign_in_at ||
        user.user_metadata?.is_new_user

      if (isFirstLogin) {
        const email = credential.email
        const fullName = credential.fullName
          ? [credential.fullName.givenName, credential.fullName.familyName]
              .filter(Boolean)
              .join(' ')
          : null

        if (email || fullName) {
          await supabase.from('profiles').upsert({
            id: user.id,
            email,
            name: fullName,
          })
        }
      }

      return {
        success: '200',
        data: user,
      }
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: error.code || 'UNKNOWN_ERROR',
          message:
            error.code === 'ERR_REQUEST_CANCELED'
              ? 'Sign in canceled by user'
              : error.message || 'Unknown error occurred',
        },
      }
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Apple로 계속하기" onPress={handleAppleSignIn} />
    </View>
  )
}
