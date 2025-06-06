import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import axiosInstance from 'app/api-hooks/common/axiosInstance'
import { supabase } from 'app/utils/supabase'
import { asyncAuthStorage } from 'app/utils/auth'

export const initializeGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '',
    iosClientId: '',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  })
}

export const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices()
    const userInfo = await GoogleSignin.signIn()

    if (userInfo.data?.idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      })

      console.log('Google Auth access token', data.session?.access_token)
      console.log('Supabase uuid', data.session?.user.id)
      console.log('Supabase email', data.session?.user.email)

      // TODO : refactor for common function
      const res = await axiosInstance.post('/v1/user', {
        email: data.session?.user.email,
        authProvider: 'GOOGLE',
        supabaseUuid: data.session?.user.id,
        isPolicyAgreeded: true,
      })
      console.log('POST CREATE USER', res.data)
      console.log('POST CREATE USER Status', res.status)

      if (data.session) {
        await asyncAuthStorage.setSession(data.session)
      }

      return { success: res.data.ok, data, error }
    } else {
      throw new Error('no ID token present!')
    }
  } catch (error: any) {
    console.log('error', error)
    console.log('code', error.code)
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
