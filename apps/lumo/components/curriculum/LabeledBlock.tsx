import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'

interface LabeledBlockProps {
  label: string
  children: React.ReactNode
  style?: ViewStyle
}

export default function LabeledBlock({
  label,
  children,
  style,
}: LabeledBlockProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
})
