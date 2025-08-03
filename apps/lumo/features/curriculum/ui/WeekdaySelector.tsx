import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

interface WeekDaySelectorProps {
  selected: string[]
  onChange: (days: string[]) => void
}

export default function WeekdaySelector({
  selected,
  onChange,
}: WeekDaySelectorProps) {
  const toggleDay = (day: string) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day))
    } else {
      onChange([...selected, day])
    }
  }

  return (
    <View style={styles.container}>
      {DAYS.map((day) => (
        <TouchableOpacity
          key={day}
          style={[styles.day, selected.includes(day) && styles.daySelected]}
          onPress={() => toggleDay(day)}
        >
          <Text style={styles.dayText}>{day}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 6,
  },
  day: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  daySelected: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  dayText: {
    color: '#333',
  },
})
