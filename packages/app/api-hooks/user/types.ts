import { ApiResponse, BaseEntity } from 'app/api-hooks/common/common.type'

export interface User {
  role: string
  tier: string
  email: string
  uuid: string
  country: string
  langCode: string
  gender: string
  name: string
  nickname: string
  year: number
  month: number
  day: number
  age: number
  authProvider: string
  glycatedHemoglobin?: number
  isPolicyAgreeded?: boolean
  supabaseUuid?: string
  isBetaApproved?: boolean
  illness: string[]
  interest: string[]
}

export interface GetUserResponseData {
  user: User
  healthRecord: HealthRecord
  illness: IllnessEntity[]
  interest: InterestEntity[]
}

export interface GetUserResponse extends ApiResponse<GetUserResponseData> {}

export interface UserSession {
  email: string
  authProvider: string
  supabaseUuid: string
  isPolicyAgreeded: boolean
}

export interface PostUserSessionResponse extends ApiResponse<UserSession> {}

export interface UserUpdateRequest {
  country: string
  langCode: string
  gender: string
  name: string
  nickname: string
  year: number
  month: number
  day: number
  glycatedHemoglobin: number
  height: number
  weight: number
  interest: string[]
  illness: string[]
}

export enum Interest {
  GENERAL_HEALTH = 'GENERAL_HEALTH',
  DIET = 'DIET',
  DIET_MANAGEMENT = 'DIET_MANAGEMENT',
  DISEASE_MANAGEMENT = 'DISEASE_MANAGEMENT',
  SKIN = 'SKIN',
  BODY = 'BODY',
  FITNESS = 'FITNESS',
  ANTELOPE = 'ANTELOPE',
  DIARY = 'DIARY',
  TO_DO_MANAGEMENT = 'TO_DO_MANAGEMENT',
  FOOD = 'FOOD',
  TRAVEL = 'TRAVEL',
  WORK_OUT = 'WORK_OUT',
  HOBBY = 'HOBBY',
  FRIEND = 'FRIEND',
  SERVICE = 'SERVICE',
}

export enum Illness {
  OBESITY = 'OBESITY',
  STRESS = 'STRESS',
  DIABETES = 'DIABETES',
  HIGH_BLOOD_PRESSURE = 'HIGH_BLOOD_PRESSURE',
  HYPERLIPIDEMIA = 'HYPERLIPIDEMIA',
  CARDIOVASCULAR = 'CARDIOVASCULAR',
  KIDNEY = 'KIDNEY',
  RESPIRATORY = 'RESPIRATORY',
  DIGESTIVE = 'DIGESTIVE',
  LIVER_DISEASE = 'LIVER_DISEASE',
  IMMUNE_DISEASE = 'IMMUNE_DISEASE',
  JOINTS_AND_MUSCULOSKELETAL_SYSTEM = 'JOINTS_AND_MUSCULOSKELETAL_SYSTEM',
  CANCER = 'CANCER',
  MENTAL_HEALTH = 'MENTAL_HEALTH',
}

export interface HealthRecord extends BaseEntity {
  height: number
  weight: number
  userUuid: string
}

export interface IllnessEntity extends BaseEntity {
  name: Illness
  userUuid: string
  illnessUuid: string
}

export interface InterestEntity extends BaseEntity {
  name: Interest
  userUuid: string
  interestUuid: string
}

export interface UpdateUserEntity extends BaseEntity, User {}

export interface UpdateUserResponse extends ApiResponse<UpdateUserEntity> {}
