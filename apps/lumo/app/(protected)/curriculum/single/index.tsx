import React, { useState } from 'react'
import {
  ScrollView,
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native'
import LabeledBlock from '@/components/curriculum/LabeledBlock'
import UploadBox from '@/components/curriculum/UploadBox'
import Toggle from '@/components/curriculum/Toggle'

export default function CurriculumSingleScreen() {
  const [researchAllowed, setResearchAllowed] = useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <LabeledBlock label="학습 목적">
          <TextInput style={styles.input} placeholder="목적을 선택해주세요" />
        </LabeledBlock>

        <LabeledBlock label="학습 주제">
          <TextInput style={styles.input} placeholder="주제를 입력해주세요" />
        </LabeledBlock>

        <LabeledBlock label="참고 사이트 URL (선택사항)">
          <TextInput style={styles.input} placeholder="https://example.com" />
        </LabeledBlock>

        <LabeledBlock label="학습 자료">
          <TextInput style={styles.input} placeholder="자료 URL 입력" />
          <UploadBox />
        </LabeledBlock>

        <Toggle value={researchAllowed} onValueChange={setResearchAllowed} />

        <LabeledBlock label="학습 날짜 및 시간">
          <TextInput style={styles.input} placeholder="YYYY-MM-DD" />
          <TextInput style={styles.input} placeholder="HH:mm" />
        </LabeledBlock>

        <Button title="설정 완료하기" onPress={() => {}} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
})
