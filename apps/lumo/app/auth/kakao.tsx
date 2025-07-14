import { useEffect, useState } from 'react'
import { Button, View, Alert, ActivityIndicator } from 'react-native'
import * as AuthSession from 'expo-auth-session'
import { supabase } from '@/lib/supabase'

const KAKAO_CLIENT_ID = '당신의 Kakao REST API 키'
const redirectUri = AuthSession.makeRedirectUri()

export default function KakaoLoginScreen() {
  const [loading, setLoading] = useState(false)

  const handleKakaoLogin = async () => {
    const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token`
  }
}
