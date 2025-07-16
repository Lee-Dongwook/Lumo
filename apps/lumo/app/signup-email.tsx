import { useState, useEffect } from 'react'
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
import { RelativePathString, useRouter } from 'expo-router'
import { useAppMutation } from 'shared'

export default function SignupEmail() {
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [code, setCode] = useState('')
  const [timeLeft, setTimeLeft] = useState(1000)
  const [emailError, setEmailError] = useState<string | null>(null)
  const router = useRouter()

  const isValidEmail = email.includes('@') && email.includes('.')
  const isCodeValid = code.length === 6

  useEffect(() => {
    if (!isSent || timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [isSent, timeLeft])

  useEffect(() => {
    if (email === '') {
      setEmailError(null)
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.')
    } else {
      setEmailError(null)
    }
  }, [email])

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
        setTimeLeft(1000)
      },
      onError: (err: any) => {
        Alert.alert('전송 실패', err.message)
        setIsSent(false)
      },
    },
  )

  const { mutate: verifyCode, isPending: verifying } = useAppMutation(
    async () => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/verify-code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
        },
      )

      if (!res.ok) {
        const { message } = await res.json()
        throw new Error(message || '인증 실패')
      }
    },
    {
      onSuccess: () => {
        Alert.alert('인증 성공', '이메일 인증이 완료됐어요.')
        router.push('/signup-password' as RelativePathString)
      },
      onError: (err: any) => {
        Alert.alert('인증 실패', err.message)
      },
    },
  )

  const handleSend = async () => {
    if (!isValidEmail || isPending || !!emailError) return

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/check-email?email=${email}`,
      )
      const data = await res.json()

      if (data.exists) {
        setEmailError('이미 사용 중인 이메일 주소예요')
        return
      }

      setEmailError(null)
      sendVerificationCode(email)
    } catch (err) {
      Alert.alert('오류', '이메일 확인 중 오류가 발생했어요.')
    }
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
          disabled={!isValidEmail || isPending || !!emailError}
        >
          <Text style={styles.sendButtonText}>
            {isSent ? '재전송' : '인증 받기'}
          </Text>
        </TouchableOpacity>
      </View>
      {emailError && <Text style={styles.errorText}>⚠ {emailError}</Text>}
      {isSent && (
        <>
          <Text style={styles.label}>인증번호</Text>
          <TextInput
            style={styles.input}
            placeholder="인증번호 6자리를 입력해주세요"
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
          />

          {timeLeft > 0 ? (
            <Text style={styles.timer}>
              남은 시간 {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, '0')}
            </Text>
          ) : (
            <Text style={styles.timerExpired}>인증 시간이 만료되었습니다.</Text>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              { opacity: isCodeValid && timeLeft > 0 ? 1 : 0.3 },
            ]}
            onPress={verifyCode}
            disabled={!isCodeValid || timeLeft <= 0 || verifying}
          >
            <Text style={styles.nextButtonText}>확인</Text>
          </TouchableOpacity>
        </>
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
  timer: {
    color: 'red',
    marginTop: 8,
    fontWeight: 'bold',
  },
  timerExpired: {
    color: 'gray',
    marginTop: 8,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 13,
  },
})
