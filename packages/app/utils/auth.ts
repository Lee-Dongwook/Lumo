import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session } from '@supabase/supabase-js'

export const asyncAuthStorage = {
  getSession: async () => {
    const sessionString = await AsyncStorage.getItem('supabase-session')
    if (sessionString) {
      return JSON.parse(sessionString)
    }
    return null
  },
  setSession: async (session: Session) => {
    await AsyncStorage.setItem('supabase-session', JSON.stringify(session))
  },
  removeSession: async () => {
    await AsyncStorage.removeItem('supabase-session')
  },
}
