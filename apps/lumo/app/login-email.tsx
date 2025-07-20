import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAppMutation } from 'shared'
import { useUserStore } from '@/store/userStore'

interface LoginState {
  email: string
  password: string
}

export default function EmailLogin() {
  const router = useRouter()
  const [login, setLogin] = useState<LoginState>({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const { mutate: loginMuatate, isPending } = useAppMutation(
    async ({ email, password }: LoginState) => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        },
      )

      const data = await res.json()

      if (!res.ok) throw new Error(data.detail || '로그인 실패')
      return data
    },
    {
      onSuccess: (data) => {
        useUserStore.getState().login({
          token: data.access_token,
          user: data.user,
        })
        router.replace('/main')
      },
      onError: (err: any) => {
        Alert.alert('로그인 실패', err.message)
      },
    },
  )

  const handleLogin = async () => {
    const email = login.email
    const password = login.password

    loginMuatate({
      email,
      password,
    })
  }

  const isValid = login.email.length > 4 && login.password.length >= 6

  return (
    <View style={styles.container}>
      <Text style={styles.title}>email login</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일을 입력해주세요"
          value={login.email}
          onChangeText={(e) =>
            setLogin((prev) => ({
              ...prev,
              email: e,
            }))
          }
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>비밀번호</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="비밀번호를 입력해주세요"
            value={login.password}
            onChangeText={(e) =>
              setLogin((prev) => ({
                ...prev,
                password: e,
              }))
            }
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#aaa"
              style={{ marginRight: 12 }}
            />
          </Pressable>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { opacity: isValid ? 1 : 0.4 }]}
        onPress={handleLogin}
        disabled={!isValid || isPending}
      >
        <Text style={styles.buttonText}>
          {isPending ? '로그인 중...' : '로그인'}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomLinks}>
        <TouchableOpacity onPress={() => router.push('/find-password')}>
          <Text style={styles.link}>비밀번호 찾기</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>|</Text>
        <TouchableOpacity onPress={() => router.push('/signup-email')}>
          <Text style={styles.link}>이메일 회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: 36,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#9ea4af',
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomLinks: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  link: {
    color: '#5c5c5c',
    fontSize: 14,
  },
  separator: {
    color: '#ccc',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
})
