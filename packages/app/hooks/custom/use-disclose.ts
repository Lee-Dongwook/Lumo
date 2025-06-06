import React, { useState } from 'react'

const useDisclose = (initialState?: boolean) => {
  const [isOpen, setIsOpen] = useState(initialState || false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  const onToggle = () => setIsOpen(!isOpen)
  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  }
}

export default useDisclose
