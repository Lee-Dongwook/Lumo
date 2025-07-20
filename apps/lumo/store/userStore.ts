import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

type AuthProvider = 'google' | 'naver' | 'apple' | 'email'

interface UserAgreement {
  terms: boolean
  privacy: boolean
}

export interface User {
  id: string
  email: string
  name?: string
  created_at?: string
  agreement?: UserAgreement
  supabaseUuid?: string
  profileImageUrl?: string
  authProvider?: AuthProvider
}

interface UserState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  login: (payload: { token: string; user: User }) => void
  logout: () => void
}

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: ({ token, user }) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
