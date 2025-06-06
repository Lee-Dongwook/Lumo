import React, { useState, useEffect, useMemo } from 'react'
import { supabase } from 'app/utils/supabase'

interface Props {
  email?: string
  event?: string
}

const useRealtime = ({ email, event = 'notice' }: Props) => {
  const [message, setMessage] = useState({})

  const roomChannel = useMemo(() => {
    if (!email) {
      return null
    }
    return supabase.channel(email)
  }, [email])

  useEffect(() => {
    if (!roomChannel) {
      return
    }
    roomChannel.on('broadcast', { event }, (payload) => {
      const { type, ...rest } = payload
      setMessage(rest)
    })

    const subscription = roomChannel.subscribe((status) => {
      // console.log('app sub status:', status)
    })

    return () => {
      roomChannel.unsubscribe()
    }
  }, [roomChannel, event])

  return { message }
}

export default useRealtime
