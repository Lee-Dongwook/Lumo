export interface ChatMessage {
  id: string
  user_id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  session_id?: string
}

export interface ChatSession {
  id: string
  user_id: string
  title?: string
  created_at: string
  updated_at: string
  message_count: number
}

export interface ChatRequest {
  id: string
  user_id: string
  request_type: 'chat'
  source: string
  content: {
    response: string
  }
  status: 'completed' | 'pending' | 'failed'
  created_at: string
}

export interface ChatState {
  currentSession: ChatSession | null
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}
