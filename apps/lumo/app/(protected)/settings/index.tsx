import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  AlertButton,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useUserStore } from '@/store/userStore'

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
)

export default function SettingsScreen() {
  const router = useRouter()
  const { user, logout, token } = useUserStore()

  const deleteAccountButton: AlertButton[] = [
    { text: '취소', style: 'cancel' },
    { text: '탈퇴하기', style: 'destructive', onPress: async () => {} },
  ]

  const handleLogout = () => {
    logout()
    Alert.alert('로그아웃 되었습니다. 홈 화면으로 이동합니다.')
    router.replace('/')
  }

  const handleDeleteAccount = async () => {
    Alert.alert(
      '회원 탈퇴',
      '정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.',
      deleteAccountButton,
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>

      {/* 유저 정보 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 정보</Text>
        <InfoRow label="이메일" value={user?.email} />
        <InfoRow label="이름" value={user?.name || '없음'} />
        <InfoRow
          label="가입일"
          value={
            user?.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : '알 수 없음'
          }
        />
        <InfoRow
          label="약관 동의"
          value={
            user?.agreement
              ? `${user.agreement.terms ? '이용약관 ✅' : '❌'} / ${
                  user.agreement.privacy ? '개인정보 ✅' : '❌'
                }`
              : '정보 없음'
          }
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>로그아웃</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ff4d4f' }]}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.buttonText}>회원 탈퇴</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#9ea4af',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
})
