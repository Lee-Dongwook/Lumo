import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

interface TimeRangeInputProps {
  from: string
  to: string
  onChange: (from: string, to: string) => void
}

export default function TimeRangeInput({
  from,
  to,
  onChange,
}: TimeRangeInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="시작 시간"
        value={from}
        onChangeText={(t) => onChange(t, to)}
      />
      <TextInput
        style={styles.input}
        placeholder="종료 시간"
        value={to}
        onChangeText={(t) => onChange(from, t)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
})
