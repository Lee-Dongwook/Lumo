export interface User {
  user: UserElement[]
  paging: Paging
}

export interface Paging {
  totalCount: number
  lastOffset: number
}

export interface UserElement {
  id: number
  uuid: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
  status: string
  role: string
  tier: string
  email: string
  supabase_uuid: string
  auth_provider: string
  country: string
  lang_code: string
  gender: string
  is_policy_agreeded: boolean
  name: string
  nickname: string
  year: number
  month: number
  day: number
  glycated_hemoglobin: number
  age: number
  policy_agreeded_at: Date
}

export enum AuthProvider {
  Apple = 'APPLE',
  Google = 'GOOGLE',
  Kakao = 'KAKAO',
  Naver = 'NAVER',
}

export enum Role {
  User = 'USER',
}

export enum Status {
  Active = 'ACTIVE',
}

export enum Tier {
  Free = 'FREE',
}

export interface UserDetail {
  id: number
  uuid: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
  status: Status
  role: Role
  tier: Tier
  email: string
  supabase_uuid: string
  auth_provider: AuthProvider
  country: string
  lang_code: string
  gender: Gender
  is_policy_agreeded: boolean
  name: string
  nickname: string
  year: number
  month: number
  day: number
  glycated_hemoglobin: number
  age: string | number
  policy_agreeded_at: Date
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
}
