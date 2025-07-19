import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Button,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useAppMutation } from 'shared'

export default function SignupPassword() {
  const router = useRouter()
  const { email } = useLocalSearchParams<{ email: string }>()

  console.log('Email from params:', email)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const isLengthValid = password.length >= 8
  const hasTwoTypes =
    [/[a-zA-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].filter((r) => r.test(password))
      .length >= 2
  const isMatch = password && password === confirmPassword

  const { mutate: signUp, isPending: isSignUpPending } = useAppMutation(
    async () => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      )

      if (!res.ok) {
        const { message } = await res.json()
        throw new Error(message || '인증 실패')
      }
    },
  )

  const handleNext = async () => {
    if (!isMatch) {
      Alert.alert('비밀번호 조건을 확인해주세요.')
      return
    }

    signUp(undefined, {
      onSuccess: () => {
        Alert.alert('회원가입 완료', '이제 프로필을 설정해볼까요?')
        // router.push('/onboarding/profile') // 예시: 다음 화면
      },
      onError: (err: any) => {
        Alert.alert('회원가입 실패', err.message || '다시 시도해주세요.')
      },
    })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign up</Text>

      {/* 비밀번호 입력 */}
      <Text style={styles.label}>비밀번호</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="8자리 이상, 문자/숫자/기호 중 2개 이상"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
          {React.createElement(Ionicons as any, {
            name: showPassword ? 'eye-off-outline' : 'eye-outline',
            size: 20,
            color: '#888',
          })}
        </TouchableOpacity>
      </View>

      <View style={styles.checkList}>
        <Text style={[styles.checkItem, isLengthValid && styles.valid]}>
          ✓ 8자리 이상
        </Text>
        <Text style={[styles.checkItem, hasTwoTypes && styles.valid]}>
          ✓ 문자/숫자/기호 중 2개 이상
        </Text>
      </View>

      {/* 비밀번호 확인 */}
      <Text style={[styles.label, { marginTop: 24 }]}>비밀번호 확인</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호를 재입력해주세요"
          secureTextEntry={!showConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirm((prev) => !prev)}>
          {React.createElement(Ionicons as any, {
            name: showConfirm ? 'eye-off-outline' : 'eye-outline',
            size: 20,
            color: '#888',
          })}
        </TouchableOpacity>
      </View>

      <Text style={[styles.checkItem, isMatch && styles.valid]}>
        ✓ 비밀번호 일치
      </Text>

      <Button
        title="다음"
        onPress={handleNext}
        disabled={!isLengthValid || !hasTwoTypes || !isMatch || loading}
        color="#007AFF"
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingRight: 8,
  },
  checkList: {
    marginTop: 8,
    marginLeft: 8,
  },
  checkItem: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  valid: {
    color: '#007AFF',
  },
})
