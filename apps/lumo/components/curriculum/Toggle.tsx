import React from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'

interface ToggleProps {
  value: boolean
  onValueChange: (val: boolean) => void
}

export default function Toggle({ value, onValueChange }: ToggleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>AI 웹 리서치 허용</Text>
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
