import { Session } from '@supabase/supabase-js'
import { supabase } from 'app/utils/supabase'
import React, { useEffect, useState } from 'react'

const useGetUser = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  return {
    session,
  }
}

export default useGetUser
