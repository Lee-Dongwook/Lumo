import { create } from 'zustand'

type AuthProvider = 'google' | 'naver' | 'apple' | 'email'

export interface SupabaseUser {
  email: string
  name?: string
  profileImageUrl?: string
  supabaseUuid: string
  authProvider: AuthProvider
}

interface UserState {
  user: SupabaseUser | null
  isLoggedIn: boolean
  setUser: (user: SupabaseUser) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: true }),
  clearUser: () => set({ user: null, isLoggedIn: false }),
}))
