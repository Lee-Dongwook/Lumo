import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  type ImageSourcePropType,
} from 'react-native'
import { handleOAuthLogin } from '../api/signIn'

interface SocicalButtonProps {
  icon?: ImageSourcePropType
  text: string
  onPress: () => void
}

const SocialButton = ({ icon, text, onPress }: SocicalButtonProps) => (
  <TouchableOpacity style={styles.socialButton} onPress={onPress}>
    <Image source={icon} style={styles.icon} />
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
)

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          //   source={require('../../../assets/star.png')}
          style={styles.logo}
        />
        <Text style={styles.slogan}>Lumo</Text>
      </View>

      <View style={styles.buttonContainer}>
        <SocialButton
          //   icon={require('../../../assets/naver.png')}
          text="네이버로 계속하기"
          onPress={() => handleOAuthLogin('google')}
        />
        <SocialButton
          //   icon={require('../../../assets/google.png')}
          text="Google로 계속하기"
          onPress={() => handleOAuthLogin('google')}
        />
        <SocialButton
          //   icon={require('../../../assets/apple.png')}
          text="Apple로 계속하기"
          onPress={() => handleOAuthLogin('apple')}
        />
        <TouchableOpacity>
          <Text style={styles.emailText}>이메일로 계속하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
    paddingVertical: 100,
    paddingHorizontal: 24,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 12,
  },
  slogan: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
  },
  socialButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  emailText: {
    marginTop: 16,
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
})
