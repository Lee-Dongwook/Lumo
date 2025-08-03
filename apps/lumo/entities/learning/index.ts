export type LearningMode = 'single' | 'curriculum'

export interface SingleMeta {
  date: string
  time: string
  call_time: number
}

export interface CurriculumMeta {
  start_date: string
  end_date: string
  total_sessions: number
  repeat_days: string[]
  session_time_from: string
  session_time_to: string
  call_time: number
}

export interface LearningScheduleBase {
  mode: LearningMode
  purpose?: string
  subject: string
  reference_urls?: string[]
  material_url?: string
  material_file?: string
  use_research?: boolean
  mode_meta: SingleMeta | CurriculumMeta
}

export interface LearningSchedule extends LearningScheduleBase {
  id: string
  user_id: string
  created_at: string
  updated_at?: string
}
