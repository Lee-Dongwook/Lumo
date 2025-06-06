import { useRef, useCallback } from 'react'
import { EventEmitter } from 'events'

const loggedEventEmitter = new EventEmitter()

export function useLoggedEvent() {
  const emitLogged = useCallback(() => {
    loggedEventEmitter.emit('logged')
  }, [])

  const onLogged = useCallback((callback: () => void) => {
    loggedEventEmitter.on('logged', callback)
    return () => {
      loggedEventEmitter.off('logged', callback)
    }
  }, [])

  return {
    emitLogged,
    onLogged,
  }
}
