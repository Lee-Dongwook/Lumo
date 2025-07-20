import {
  RTCPeerConnection,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc'
import { socket } from './socket'
import type { CreateOfferProps, CreateAnswerProps } from './types'

export const createOffer = async ({
  myId,
  targetId,
  onRemoteStream,
}: CreateOfferProps) => {
  const pc = new RTCPeerConnection()
  const stream = await mediaDevices.getUserMedia({ audio: true, video: false })
  stream.getTracks().forEach((track) => pc.addTrack(track, stream))

  const remoteStream = new MediaStream()
  ;(pc as any).onaddstream = (event: any) => {
    onRemoteStream?.(event.stream)
  }

  const offer = await pc.createOffer({
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
  })
  await pc.setLocalDescription(offer)

  socket.emit('offer', { from: myId, to: targetId, sdp: offer.sdp })

  socket.on('answer', async ({ sdp }) => {
    await pc.setRemoteDescription({ type: 'answer', sdp })
  })

  socket.on('ice-candidate', async ({ candidate }) => {
    if (candidate) await pc.addIceCandidate(candidate)
  })
  ;(pc as any).onicecandidate = ({ candidate }: { candidate: any }) => {
    if (candidate) {
      socket.emit('ice_candidate', { from: myId, to: targetId, candidate })
    }
  }

  return { pc, localStream: stream, remoteStream }
}

export const createAnswer = async ({
  myId,
  targetId,
  offerSdp,
  onRemoteStream,
}: CreateAnswerProps) => {
  const pc = new RTCPeerConnection()
  const stream = await mediaDevices.getUserMedia({ audio: true, video: false })
  stream.getTracks().forEach((track) => pc.addTrack(track, stream))

  await pc.setRemoteDescription({ type: 'offer', sdp: offerSdp })
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)

  socket.emit('answer', { from: myId, to: targetId, sdp: answer.sdp })

  const remoteStream = new MediaStream()
  ;(pc as any).onaddstream = (event: { stream: any }) => {
    event.stream.getTracks().forEach((track: any) => {
      remoteStream.addTrack(track)
    })
    onRemoteStream?.(event.stream)
  }

  socket.on('ice-candidate', async ({ candidate }) => {
    if (candidate) await pc.addIceCandidate(candidate)
  })
  ;(pc as any).onicecandidate = ({ candidate }: { candidate: any }) => {
    if (candidate) {
      socket.emit('ice_candidate', { from: myId, to: targetId, candidate })
    }
  }

  return { pc, localStream: stream }
}
