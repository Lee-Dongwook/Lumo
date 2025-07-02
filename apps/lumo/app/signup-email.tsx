import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAppMutation } from 'shared'

export default function SignupEmail() {
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  const router = useRouter()

  const isValidEmail = email.includes('@') && email.includes('.')

  const { mutate: sendVerificationCode, isPending } = useAppMutation(
    async (email: string) => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/send-code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      )

      if (!res.ok) {
        const { message } = await res.json()
        throw new Error(message || '인증번호 전송 실패')
      }
    },
    {
      onSuccess: () => {
        Alert.alert(
          '인증번호 전송 완료',
          '입력하신 이메일로 인증번호를 보냈어요.',
        )
        setIsSent(true)
      },
      onError: (err: any) => {
        Alert.alert('전송 실패', err.message)
        setIsSent(false)
      },
    },
  )

  const handleSend = () => {
    if (!isValidEmail || isPending) return
    sendVerificationCode(email)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Sign up</Text>

      <View style={styles.inputRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력해주세요"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.sendButton, { opacity: isValidEmail ? 1 : 0.5 }]}
          onPress={handleSend}
          disabled={!isValidEmail || isPending}
        >
          <Text style={styles.sendButtonText}>인증 받기</Text>
        </TouchableOpacity>
      </View>
      {isSent && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            router.push({ pathname: '/signup/code', params: { email } })
          }
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    paddingTop: 72,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#9ea4af',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#131417',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
