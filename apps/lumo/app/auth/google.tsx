import { useState, useEffect } from 'react'
import { Button, View, Text, Alert } from 'react-native'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '@/lib/supabase'

// 로그인 버튼 누르면 웹 브라우저가 열리고, 구글 로그인 페이지로 이동함.
WebBrowser.maybeCompleteAuthSession()

export default function GoogleLoginScreen() {
  const [userInfo, setUserInfo] = useState<any>(null)

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '아까 웹 클라이언트 아이디',
    androidClientId:
      '412075712573-kl21umbv3e9rvnt0k6not93tdsl6abrr.apps.googleusercontent.com',
    iosClientId: '',
  })

  useEffect(() => {
    if (response?.type === 'success') {
      const { idToken, accessToken } = response.authentication!

      // 1. Supabase 로그인
      if (idToken) {
        signInWithSupabase(idToken)
      }

      // 2. 유저 정보 저장
      if (accessToken) {
        fetchAndStoreGoogleUser(accessToken)
      }
    }
  }, [response])

  const signInWithSupabase = async (idToken: string) => {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    })

    if (error) {
      Alert.alert('Supabase 로그인 실패', error.message)
    } else {
      console.log('✅ Supabase 로그인 성공:', data)
    }
  }

  const fetchAndStorGoogleUser = async (token: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const googleUser = await res.json()
      await AsyncStorage.setItem('@user', JSON.stringify(googleUser))
      setUserInfo(googleUser)
      console.log('✅ Google 사용자 정보 저장 완료:', googleUser)
    } catch (e) {
      console.error('사용자 정보 가져오기 실패', e)
    }
  }

  const handlePress = async () => {
    const cachedUser = await AsyncStorage.getItem('@user')
    if (cachedUser) {
      setUserInfo(JSON.parse(cachedUser))
    } else {
      promptAsync()
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        disabled={!request}
        title="Google로 계속하기"
        onPress={handlePress}
      />
    </View>
  )
}
