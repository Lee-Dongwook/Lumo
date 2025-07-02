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
import { supabase } from '@/lib/supabase'

export default function SignupEmail() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isValidEmail = email.includes('@') && email.includes('.')

  const handleSendEmail = async () => {
    if (!isValidEmail) return

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password: 'temp-password', // 실제 앱에서는 2단계로 진행하거나 OTP flow로 바꾸세요
    })

    if (error) {
      Alert.alert('회원가입 실패', error.message)
    } else {
      Alert.alert(
        '이메일 전송 완료',
        '가입 안내 메일이 전송되었습니다. 메일함을 확인해주세요.',
      )
      router.back()
    }

    setLoading(false)
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
          onPress={handleSendEmail}
          disabled={!isValidEmail || loading}
        >
          <Text style={styles.sendButtonText}>인증 받기</Text>
        </TouchableOpacity>
      </View>
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
})
