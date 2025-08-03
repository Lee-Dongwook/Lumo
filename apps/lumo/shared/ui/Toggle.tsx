import React from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'

interface ToggleProps {
  label: string
  value: boolean
  onValueChange: (val: boolean) => void
}

export default function Toggle({ label, value, onValueChange }: ToggleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
}) 