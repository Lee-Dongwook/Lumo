import { useState, useEffect } from 'react'
import { Button, View, Text, Alert } from 'react-native'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from '@/lib/supabase'
import { asyncAuthStorage } from '@/utils/auth'

// 로그인 버튼 누르면 웹 브라우저가 열리고, 구글 로그인 페이지로 이동함.
WebBrowser.maybeCompleteAuthSession()

const initializeGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      '412075712573-ja88mtjt8asfkktbn7mrjkpc702g6iuj.apps.googleusercontent.com',
    iosClientId:
      '412075712573-j3tj7rgcniq0jpv4nrscevalre2vmml0.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  })
}

export default function GoogleLoginScreen() {
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()

      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.data.idToken,
        })

        if (data.session) {
          await asyncAuthStorage.setSession(data.session)
        }

        return { success: '200', data, error }
      } else {
        throw new Error('no ID token present!')
      }
    } catch (error: any) {
      let errorMessage = 'Unknown error occurred'

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign in cancelled'
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign in already in progress'
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Play services not available'
      }

      return {
        success: false,
        error: {
          code: error.code,
          message: errorMessage,
        },
      }
    }
  }

  useEffect(() => {
    initializeGoogleSignIn()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Google로 계속하기" onPress={handleGoogleSignIn} />
    </View>
  )
}
