import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'auth_provider'

export const saveAuthProvider = (provider: string) =>
  AsyncStorage.setItem(KEY, provider)
export const getAuthProvider = () => AsyncStorage.getItem(KEY)
export const clearAuthProvider = () => AsyncStorage.removeItem(KEY) 