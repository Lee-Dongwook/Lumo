import { login } from '@react-native-seoul/kakao-login'
import { View, Button } from 'react-native'
import { asyncAuthStorage } from '@/utils/auth'
import { supabase } from '@/lib/supabase'

export default function KakaoLoginScreen() {
  const handleKakaoSignIn = async () => {
    const result = await login()
    try {
      if (result.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'kakao',
          token: result.idToken,
        })

        if (data.session) {
          await asyncAuthStorage.setSession(data.session)
        }

        return { success: '200', data, error }
      } else {
        throw new Error('no ID token present!')
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Kakao로 계속하기" onPress={handleKakaoSignIn} />
    </View>
  )
}
