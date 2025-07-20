import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  Entypo,
} from '@expo/vector-icons'

export default function Main() {
  const router = useRouter()
  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.container}>
      {/* 말풍선 */}
      <View style={styles.speechBubble}>
        <Text style={styles.speechText}>
          오늘 전화로 얘기 나누고 싶은 게 있어?
        </Text>
      </View>

      {/* 캐릭터 */}
      <View style={styles.characterSection}>
        <TouchableOpacity>
          <Text style={styles.arrow}>{'<'}</Text>
        </TouchableOpacity>

        <Image
          //   source={require('../assets/character.png')}
          style={styles.character}
        />

        <TouchableOpacity>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* 전화 / 채팅 버튼 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatButton}>
          <Ionicons name="chatbubble-ellipses" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* 콘텐츠 메뉴 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.menuScroll}
      >
        <View style={styles.menuItem}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={20}
            color="#6C4DFF"
          />
          <Text style={styles.menuText}>커리큘럼</Text>
        </View>
        <View style={styles.menuItem}>
          <MaterialCommunityIcons
            name="newspaper-variant-outline"
            size={20}
            color="#6C4DFF"
          />
          <Text style={styles.menuText}>뉴스 루틴</Text>
        </View>
        <View style={styles.menuItem}>
          <FontAwesome5 name="globe" size={20} color="#0B9A6D" />
          <Text style={styles.menuText}>영어 회화</Text>
        </View>
        <View style={[styles.menuItem, styles.menuItemLight]}>
          <Ionicons name="add" size={20} color="#6C4DFF" />
          <Text style={styles.menuText}>콘텐츠 추가</Text>
        </View>
        <View style={styles.menuItem}>
          <Entypo name="calendar" size={20} color="#6C4DFF" />
          <Text style={styles.menuText}>루틴 설정</Text>
        </View>
      </ScrollView>

      {/* 카드 */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>오늘의 예약</Text>
        <Text style={styles.cardDesc}>20:00 | 뉴스 리서치 전화 예정</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>커리큘럼 보기</Text>
        <Text style={styles.cardDesc}>예약된 학습</Text>
      </View>

      {/* 설정 버튼 */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push('/settings')}
      >
        <Ionicons name="settings-outline" size={20} color="#6C4DFF" />
        <Text style={styles.menuText}>환경 설정</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFF8E5',
  },
  container: {
    alignItems: 'center',
    padding: 24,
  },
  speechBubble: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginTop: 40,
  },
  speechText: {
    fontSize: 16,
    fontWeight: '500',
  },
  characterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  arrow: {
    fontSize: 24,
    paddingHorizontal: 12,
  },
  character: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  callButton: {
    backgroundColor: '#34C759',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: '#FFD966',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuScroll: {
    width: '100%',
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  menuItemLight: {
    backgroundColor: 'transparent',
  },
  menuText: {
    fontSize: 13,
    marginTop: 4,
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    padding: 16,
    borderRadius: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#888',
  },
  settingsButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
})
