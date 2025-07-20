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
import type { LearningScheduleBase, SingleMeta } from '@/types/learning'

export default function CurriculumSingleScreen() {
  const [curriculumData, setCurriculumData] = useState<LearningScheduleBase>({
    mode: 'single',
    purpose: '',
    subject: '',
    reference_urls: [],
    material_url: '',
    material_file: '',
    use_research: false,
    mode_meta: {
      date: '',
      time: '',
      call_time: 0,
    } as SingleMeta,
  })

  const updateCurriculumData = (
    key: keyof typeof curriculumData,
    value: string | string[] | boolean,
  ) => {
    setCurriculumData((prev) => ({ ...prev, [key]: value }))
  }

  const updateCurriculumMeta = (
    key: keyof SingleMeta,
    value: string | number,
  ) => {
    setCurriculumData((prev) => ({
      ...prev,
      mode_meta: {
        ...(prev.mode_meta as SingleMeta),
        [key]: value,
      },
    }))
  }

  const onSubmit = async () => {
    const payload = {
      mode: 'single',
      subject: curriculumData.subject,
      purpose: curriculumData.purpose,
      reference_urls: curriculumData.reference_urls?.length
        ? curriculumData.reference_urls
        : [],
      material_url: curriculumData.material_url || undefined,
      use_research: curriculumData.use_research as boolean,
      mode_meta: {
        date: (curriculumData.mode_meta as SingleMeta).date || '',
        time: (curriculumData.mode_meta as SingleMeta).time || '',
        call_time: (curriculumData.mode_meta as SingleMeta).call_time || 0,
      },
    }

    console.log('Submitting curriculum data:', payload)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <LabeledBlock label="학습 목적">
          <TextInput
            style={styles.input}
            value={curriculumData.purpose}
            onChangeText={(text) => updateCurriculumData('purpose', text)}
            placeholder="목적을 선택해주세요"
          />
        </LabeledBlock>

        <LabeledBlock label="학습 주제">
          <TextInput
            style={styles.input}
            placeholder="주제를 입력해주세요"
            value={curriculumData.subject}
            onChangeText={(text) => updateCurriculumData('subject', text)}
          />
        </LabeledBlock>

        <LabeledBlock label="참고 사이트 URL (선택사항)">
          <TextInput
            style={styles.input}
            placeholder="https://example.com"
            value={curriculumData.reference_urls?.join(', ') ?? ''}
            onChangeText={(text) =>
              updateCurriculumData(
                'reference_urls',
                text.split(',').map((url) => url.trim()),
              )
            }
          />
        </LabeledBlock>

        <LabeledBlock label="학습 자료">
          <TextInput
            style={styles.input}
            placeholder="자료 URL 입력"
            value={curriculumData.material_url}
            onChangeText={(text) => updateCurriculumData('material_url', text)}
          />
          <UploadBox />
        </LabeledBlock>

        <Toggle
          value={curriculumData.use_research as boolean}
          onValueChange={(value) => updateCurriculumData('use_research', value)}
        />

        <LabeledBlock label="학습 날짜 및 시간">
          <TextInput
            style={styles.input}
            value={(curriculumData.mode_meta as SingleMeta).date}
            onChangeText={(text) => updateCurriculumMeta('date', text)}
            placeholder="YYYY-MM-DD"
          />
          <TextInput
            style={styles.input}
            value={(curriculumData.mode_meta as SingleMeta).time}
            onChangeText={(text) => updateCurriculumMeta('time', text)}
            placeholder="HH:mm"
          />
        </LabeledBlock>

        <Button title="설정 완료하기" onPress={onSubmit} />
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
