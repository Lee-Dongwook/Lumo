import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
} from 'react-native'
import {
  RelativePathString,
  useLocalSearchParams,
  useRouter,
} from 'expo-router'
import { CheckIcon, XIcon } from 'lucide-react-native'
import { useState } from 'react'
import { useAppMutation } from 'shared'

export default function UserAgreementForm() {
  const router = useRouter()
  const { email, password } = useLocalSearchParams<{
    email: string
    password: string
  }>()

  const [visible, setVisible] = useState(true)
  const [agreeAll, setAgreeAll] = useState(false)

  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
  })

  const terms = [
    { id: 'terms', label: '이용약관 동의 (필수)' },
    { id: 'privacy', label: '개인정보 수집 이용 동의 (필수)' },
  ]

  const toggleAll = () => {
    const next = !agreeAll
    setAgreeAll(next)
    setAgreements({
      terms: next,
      privacy: next,
    })
  }

  const toggleItem = (id: keyof typeof agreements) => {
    const updated = {
      ...agreements,
      [id]: !agreements[id],
    }
    setAgreements(updated)
    setAgreeAll(Object.values(updated).every(Boolean))
  }

  const { mutate: submitAgreement, isPending: isSubmitting } = useAppMutation(
    async (payload: { email: string; agreement: typeof agreements }) => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/agreement`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || '약관 동의 업데이트 실패')
      }

      return res.json()
    },
  )

  const handleSubmit = () => {
    if (!agreements.terms || !agreements.privacy) {
      Alert.alert('알림', '모든 필수 약관에 동의해야 가입할 수 있습니다.')
      return
    }

    submitAgreement(
      { email, agreement: agreements },
      {
        onSuccess: () => {
          Alert.alert('완료', '회원가입이 완료되었습니다.')
          router.push('/login' as RelativePathString)
        },
        onError: (err: any) => {
          Alert.alert('오류', err.message || '약관 동의 저장 실패')
        },
      },
    )
  }

  if (!visible) return null

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>약관 동의</Text>
            <Pressable onPress={() => setVisible(false)}>
              <XIcon size={20} color="#666" />
            </Pressable>
          </View>

          {/* 전체 동의 */}
          <Pressable onPress={toggleAll} style={styles.agreeAllContainer}>
            <View style={[styles.checkbox, agreeAll && styles.checkboxChecked]}>
              {agreeAll && <CheckIcon size={14} color="white" />}
            </View>
            <Text style={styles.agreeAllText}>전체 동의</Text>
          </Pressable>

          <View style={styles.separator} />

          {/* 약관 항목 */}
          {terms.map((term) => (
            <Pressable
              key={term.id}
              style={styles.termItem}
              onPress={() => toggleItem(term.id as keyof typeof agreements)}
            >
              <View style={styles.termLeft}>
                <View
                  style={[
                    styles.checkbox,
                    agreements[term.id as keyof typeof agreements] &&
                      styles.checkboxChecked,
                  ]}
                >
                  {agreements[term.id as keyof typeof agreements] && (
                    <CheckIcon size={14} color="white" />
                  )}
                </View>
                <Text style={styles.termLabel}>{term.label}</Text>
              </View>
              <Text style={styles.arrow}>{'>'}</Text>
            </Pressable>
          ))}

          {/* 회원가입 버튼 */}
          <TouchableOpacity
            style={styles.submitButton}
            disabled={isSubmitting}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '처리 중...' : '회원가입'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  agreeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  agreeAllText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  termItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  termLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termLabel: {
    fontSize: 15,
    marginLeft: 8,
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
})
