import { supabase } from 'app/utils/supabase'
import { router } from 'expo-router'
import { asyncAuthStorage } from 'app/utils/auth'

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
  } else {
    await asyncAuthStorage.removeSession()
    router.replace('/login')
  }
}
