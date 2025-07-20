import React, { useState } from 'react'
import {
  ScrollView,
  SafeAreaView,
  TextInput,
  Button,
  StyleSheet,
  Text,
} from 'react-native'
import LabeledBlock from '@/components/curriculum/LabeledBlock'
import UploadBox from '@/components/curriculum/UploadBox'
import Toggle from '@/components/curriculum/Toggle'
import WeekdaySelector from '@/components/curriculum/WeekdaySelector'
import TimeRangeInput from '@/components/curriculum/TimeRangeInput'
import type { LearningScheduleBase, CurriculumMeta } from '@/types/learning'

export default function CurriculumDoubleScreen() {
  const [days, setDays] = useState<string[]>([])
  const [fromTime, setFromTime] = useState('19:00')
  const [toTime, setToTime] = useState('20:00')

  const [curriculumData, setCurriculumData] = useState<LearningScheduleBase>({
    mode: 'curriculum',
    purpose: '',
    subject: '',
    reference_urls: [],
    material_url: '',
    material_file: '',
    use_research: false,
    mode_meta: {
      start_date: '',
      end_date: '',
      total_sessions: 0,
      repeat_days: [],
      session_time_from: '',
      session_time_to: '',
      call_time: 0,
    } as CurriculumMeta,
  })

  const updateCurriculumData = (
    key: keyof typeof curriculumData,
    value: string | string[] | boolean,
  ) => {
    setCurriculumData((prev) => ({ ...prev, [key]: value }))
  }

  const updateCurriculumMeta = (
    key: keyof CurriculumMeta,
    value: string | number | string[],
  ) => {
    setCurriculumData((prev) => ({
      ...prev,
      mode_meta: {
        ...(prev.mode_meta as CurriculumMeta),
        [key]: value,
      },
    }))
  }

  const onSubmit = async () => {
    const payload = {
      mode: 'curriculum',
      subject: curriculumData.subject,
      purpose: curriculumData.purpose,
      reference_urls: curriculumData.reference_urls?.length
        ? curriculumData.reference_urls
        : [],
      material_url: curriculumData.material_url || undefined,
      use_research: curriculumData.use_research as boolean,
      mode_meta: {
        start_date:
          (curriculumData.mode_meta as CurriculumMeta).start_date || '',
        end_date: (curriculumData.mode_meta as CurriculumMeta).end_date || '',
        total_sessions:
          (curriculumData.mode_meta as CurriculumMeta).total_sessions || 0,
        repeat_days:
          (curriculumData.mode_meta as CurriculumMeta).repeat_days || [],
        session_time_from:
          (curriculumData.mode_meta as CurriculumMeta).session_time_from || '',
        session_time_to:
          (curriculumData.mode_meta as CurriculumMeta).session_time_to || '',
        call_time: (curriculumData.mode_meta as CurriculumMeta).call_time || 0,
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
            placeholder="목적을 선택해주세요"
            value={curriculumData.purpose}
            onChangeText={(text) => updateCurriculumData('purpose', text)}
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
            value={curriculumData.reference_urls?.join(', ') ?? ''}
            placeholder="https://example.com"
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
            value={curriculumData.material_url}
            placeholder="자료 URL 입력"
            onChangeText={(text) => updateCurriculumData('material_url', text)}
          />
          <UploadBox />
        </LabeledBlock>

        <Toggle
          value={curriculumData.use_research as boolean}
          onValueChange={(value) => updateCurriculumData('use_research', value)}
        />

        <LabeledBlock label="학습 일정">
          <TextInput
            style={styles.input}
            value={(curriculumData.mode_meta as CurriculumMeta).start_date}
            onChangeText={(text) => updateCurriculumMeta('start_date', text)}
            placeholder="시작일 (YYYY-MM-DD)"
          />
          <TextInput
            style={styles.input}
            value={(curriculumData.mode_meta as CurriculumMeta).end_date}
            onChangeText={(text) => updateCurriculumMeta('end_date', text)}
            placeholder="종료일 (YYYY-MM-DD)"
          />
          <TextInput
            style={styles.input}
            placeholder="총 학습 회수"
            keyboardType="numeric"
            value={(
              curriculumData.mode_meta as CurriculumMeta
            ).total_sessions.toString()}
            onChangeText={(text) =>
              updateCurriculumMeta('total_sessions', parseInt(text, 10))
            }
          />
          <WeekdaySelector selected={days} onChange={setDays} />
        </LabeledBlock>

        <LabeledBlock label="학습 시간 설정">
          <TimeRangeInput
            from={fromTime}
            to={toTime}
            onChange={(f, t) => {
              setFromTime(f)
              setToTime(t)
            }}
          />
        </LabeledBlock>

        <LabeledBlock label="전화 시간">
          <Text>슬라이더 추가 예정 (선택된 시간: 10분)</Text>
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
