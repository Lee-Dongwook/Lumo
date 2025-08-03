export type AuthProvider = 'google' | 'naver' | 'apple' | 'email'

export interface UserAgreement {
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

export interface UserState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
}
