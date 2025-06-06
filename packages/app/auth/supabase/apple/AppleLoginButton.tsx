import { handleAppleSignIn } from './appleAuth'
import { TouchableOpacity, View } from 'react-native'
import { Typography } from 'app/design/typography'
import { SolitoImage } from 'solito/image'
import { SocialIcon } from 'app/constants/icon'
import { useI18n } from 'app/provider/i18n/i18n-provider'
import { router } from 'expo-router'
import axiosInstance from 'app/api-hooks/common/axiosInstance'
import { GetUserResponse } from 'app/api-hooks/user/types'

interface AppleLoginButtonProps {
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

export const AppleLoginButton = ({ onError }: AppleLoginButtonProps) => {
  const { t } = useI18n()

  const onAppleSignIn = async () => {
    console.log('onAppleSignIn')
    const result = await handleAppleSignIn()
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
    } else {
      onError?.(result.error)
    }
  }

  return (
    <TouchableOpacity
      className="h-12 w-96 flex-row items-center justify-center rounded-full bg-black"
      onPress={onAppleSignIn}
      activeOpacity={0.8}
    >
      <View className="absolute left-4 h-full justify-center">
        {/* @ts-ignore */}
        <SolitoImage
          src={SocialIcon.apple as unknown as string}
          contentFit="contain"
          style={{ width: 30, height: 30 }}
        />
      </View>
      <Typography className="text-base font-medium text-white">
        {t('auth.appleLogin')}
      </Typography>
    </TouchableOpacity>
  )
}
