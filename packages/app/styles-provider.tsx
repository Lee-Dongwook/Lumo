// @ts-nocheck
'use client'

import React from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { StyleSheet } from 'react-native'

export function StylesProvider({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => {
    const sheet = StyleSheet.getSheet()
    return (
      <style
        dangerouslySetInnerHTML={{ __html: sheet.textContext }}
        id={sheet.id}
      />
    )
  })
  return <>{children}</>
}
