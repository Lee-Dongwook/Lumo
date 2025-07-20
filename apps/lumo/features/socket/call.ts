import { HangUpProps } from './types'
import { socket } from './socket'

export const hangup = ({
  pc,
  localStream,
  remoteStream,
  myId,
  targetId,
}: HangUpProps) => {
  pc.close()
  localStream?.getTracks().forEach((track) => track.stop())
  remoteStream?.getTracks().forEach((track) => track.stop())
  socket.emit('hangup', { from: myId, to: targetId })
  console.log('📞 Call ended')
}
