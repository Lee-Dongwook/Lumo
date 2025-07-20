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
