// eslint-disable-next-line import/no-named-as-default
import io from 'socket.io-client'

export const socket = io('http://127.0.0.1:8000/ws')

export const joinSocket = (userId: string) => {
  socket.emit('join', { userId })
}
