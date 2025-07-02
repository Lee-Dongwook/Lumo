import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useRouter } from 'expo-router'

type OAuthProvider = 'google' | 'apple'

function SocialButton({
  label,
  icon,
  onPress,
}: {
  label: string
  icon?: any
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  )
}

export default function Index() {
  const router = useRouter()

  const handleOAuth = (provider: OAuthProvider) => {
    router.push(`/auth/${provider}`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✴</Text>
      <Text style={styles.subtitle}>Dreams drive your Odyssey</Text>

      <View style={styles.buttonGroup}>
        <SocialButton
          label="Google로 계속하기"
          // icon={GoogleLogo}
          onPress={() => handleOAuth('google')}
        />
        <SocialButton
          label="Apple로 계속하기"
          // icon={AppleLogo}
          onPress={() => handleOAuth('apple')}
        />
      </View>

      <TouchableOpacity onPress={() => router.push('/login-email')}>
        <Text style={styles.email}>이메일로 계속하기</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
      <SocialButton
        label="개발자 모드로 메인 이동하기"
        // icon={GoogleLogo}
        onPress={() => router.push('/main')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 36,
    color: 'white',
    marginBottom: 16,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 48,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  email: {
    color: 'white',
    textDecorationLine: 'underline',
    marginTop: 12,
  },
})
