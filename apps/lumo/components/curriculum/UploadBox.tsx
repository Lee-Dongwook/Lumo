import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function UploadBox() {
  return (
    <TouchableOpacity style={styles.uploadContainer}>
      <FontAwesome name="file-pdf-o" size={24} color="#888" />
      <Text style={styles.uploadText}>파일을 드래그하거나 클릭하여 업로드</Text>
      <Text style={styles.subText}>PDF, DOC, DOCX 지원</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  uploadContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  subText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
})
