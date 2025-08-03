import { RTCPeerConnection, MediaStream } from 'react-native-webrtc'

export interface CreateOfferProps {
  myId: string
  targetId: string
  onRemoteStream?: (stream: MediaStream) => void
}

export interface CreateAnswerProps {
  myId: string
  targetId: string
  offerSdp: string
  onRemoteStream?: (stream: MediaStream) => void
}

export interface HangUpProps {
  pc: RTCPeerConnection
  localStream?: MediaStream | null
  remoteStream?: MediaStream | null
  myId: string
  targetId: string
}

export interface CallSession {
  id: string
  user_id: string
  start_time: string
  end_time?: string
  duration?: number
  status: 'active' | 'ended' | 'failed'
  audio_url?: string
}

export interface CallRequest {
  id: string
  user_id: string
  request_type: 'call'
  source: string
  content: Record<string, any>
  status: 'completed' | 'pending' | 'failed'
  response_audio_url?: string
  created_at: string
}
