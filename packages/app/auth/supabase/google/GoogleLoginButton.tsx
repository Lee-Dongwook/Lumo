import { useEffect } from 'react'
import { TouchableOpacity, Text, Image, View } from 'react-native'
import { initializeGoogleSignIn, handleGoogleSignIn } from './googleAuth'
import { SocialIcon } from 'app/constants/icon'
import { SolitoImage } from 'solito/image'
import { useI18n } from 'app/provider/i18n/i18n-provider'
import { Typography } from 'app/design/typography'
import { router } from 'expo-router'
import axiosInstance from 'app/api-hooks/common/axiosInstance'
import { useLoggedEvent } from 'app/hooks/use-logged-event'
import { GetUserResponse } from 'app/api-hooks/user/types'

interface GoogleLoginButtonProps {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

interface OnboardingResponse {
  ok: boolean
}

async function fetchOnboarding(): Promise<OnboardingResponse> {
  const { data } = await axiosInstance.get<OnboardingResponse>(
    '/v1/user/onboarding',
  )
  return data
}

async function fetchUser(): Promise<GetUserResponse> {
  const { data } = await axiosInstance.get<GetUserResponse>('/v1/user')
  return data
}

export function GoogleLoginButton({
  onSuccess,
  onError,
}: GoogleLoginButtonProps) {
  const { t } = useI18n()
  const { emitLogged } = useLoggedEvent()
  useEffect(() => {
    initializeGoogleSignIn()
  }, [])

  const onGoogleSignIn = async () => {
    console.log('onGoogleSignIn')
    const result = await handleGoogleSignIn()
    if (result?.success) {
      const userData = await fetchUser()
      const onboardingData = await fetchOnboarding()
      if (userData.ok && userData.data.user.isBetaApproved) {
        if (onboardingData.ok) {
          router.replace('/(tabs)/(monitoring)')
        } else {
          router.push('/onboarding')
        }
      } else {
        router.replace('/cbt-guide')
      }
      emitLogged()
    } else {
      onError?.(result.error)
    }
  }

  return (
    <TouchableOpacity
      className="h-12 w-96 flex-row items-center justify-center rounded-full bg-gray-100"
      onPress={onGoogleSignIn}
    >
      <View className="absolute left-4 h-full justify-center">
        {/* @ts-ignore */}
        <SolitoImage
          src={SocialIcon.google as unknown as string}
          contentFit="contain"
          style={{ width: 30, height: 30 }}
        />
      </View>
      <Typography color="black">{t('auth.googleLogin')}</Typography>
    </TouchableOpacity>
  )
}
