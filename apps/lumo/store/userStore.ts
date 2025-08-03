import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { User, UserState, AuthProvider, UserAgreement } from '@/entities/user'

interface UserStoreState extends UserState {
  login: (payload: { token: string; user: User }) => void
  logout: () => void
}

export const useUserStore = create(
  persist<UserStoreState>(
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
