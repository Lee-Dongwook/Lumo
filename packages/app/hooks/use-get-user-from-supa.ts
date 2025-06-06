import React, { useCallback, useEffect, useState } from 'react'
import { supabase } from 'app/utils/supabase'
import { User } from '@supabase/supabase-js'

const useGetUserFromSupa = () => {
  const [userFromSupa, setUserFromSupa] = useState<User>()

  const getUserFromSupa = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error fetching user:', error)
      return
    }

    if (data?.user) {
      setUserFromSupa(data.user)
    }
  }, [])

  useEffect(() => {
    getUserFromSupa()
  }, [getUserFromSupa])

  return { userFromSupa }
}

export default useGetUserFromSupa
