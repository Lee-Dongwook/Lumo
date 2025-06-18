import { useEffect, useState } from 'react'
import { Redirect } from 'expo-router'
import { supabase } from 'app/utils/supabase'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { useI18n } from 'app/provider/i18n/i18n-provider'
import axiosInstance from 'app/api-hooks/common/axiosInstance'
import { Typography } from 'app/design/typography'
import { useLoggedEvent } from 'app/hooks/use-logged-event'
import { GetUserResponse } from 'app/api-hooks/user/types'

async function fetchUser(): Promise<GetUserResponse> {
  const { data } = await axiosInstance.get<GetUserResponse>('/v1/user')
  return data
}

export default function Index() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useI18n()
  const { emitLogged } = useLoggedEvent()

  const { data: userData, isLoading: isUserLoading } =
    useQuery<GetUserResponse>({
      queryKey: ['user'],
      queryFn: fetchUser,
      enabled: !!session,
    })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
      if (session) {
        emitLogged()
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false)
    })
  }, [emitLogged])

  if (isLoading || (session && isUserLoading)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Typography>{t('common.loading')}</Typography>
      </View>
    )
  }

  if (!session) {
    return <>Hello</>
  }

  return <Redirect href="/(tabs)/(monitoring)" />
}
