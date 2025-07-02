import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'

export default function ChatDetailPage() {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>LUMO</Text>
          <Text style={styles.online}>온라인</Text>
        </View>
        <Ionicons name="call" size={24} color="#A259FF" />
      </View>

      {/* 채팅 내용 */}
      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* 시스템 메시지 - 요약 카드 */}
        <View style={styles.botMessage}>
          <Text style={styles.sectionTitle}>💡 학습 정리</Text>
          <Text style={styles.text}>오늘 대화에서 이런 인사이트가 나왔어!</Text>

          <View style={styles.keywordBox}>
            <Text style={styles.keywordTitle}>핵심 키워드</Text>
            <View style={styles.keywords}>
              {['자기효능감', '작은 성취', '루틴'].map((word) => (
                <View key={word} style={styles.keywordChip}>
                  <Text style={styles.keywordText}>{word}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.bullet}>
              • 무기력감은 성취 경험 부족에서 온다
            </Text>
            <Text style={styles.bullet}>
              • 매일 10분씩 작은 행동을 반복하면 효과적
            </Text>
            <Text style={styles.bullet}>• 실패는 학습의 기회로 재해석하기</Text>

            <TouchableOpacity style={styles.continueButton}>
              <Text style={styles.continueText}>➜ 계속 학습 이어하기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 시스템 메시지 - 제안 */}
        <View style={styles.botMessage}>
          <Text style={styles.text}>
            요즘 무기력하다고 자주 말하는데, 우리 같이 루틴 만들어볼래? 작은
            변화가 큰 차이를 만들어낼 거야! 💪
          </Text>
        </View>

        {/* 태그 버튼 */}
        <View style={styles.tagRow}>
          {['오늘 감정 정리', '루틴 챙기기', '회고하기'].map((tag, idx) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                idx === 0
                  ? styles.tagPurple
                  : idx === 1
                    ? styles.tagBlue
                    : styles.tagGreen,
              ]}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 유저 메시지 */}
        <View style={styles.userMessage}>
          <Text style={styles.userText}>
            더 자세히 알려줘! 특히 루틴 만드는 방법이 궁금해
          </Text>
        </View>

        {/* 빠른 응답 */}
        <View style={styles.quickReplies}>
          {['더 자세히 알려줘', '요약해줘', '전화로 더 얘기할래?'].map(
            (item) => (
              <TouchableOpacity key={item} style={styles.quickButton}>
                <Text style={styles.quickText}>{item}</Text>
              </TouchableOpacity>
            ),
          )}
        </View>
      </ScrollView>

      {/* 입력창 */}
      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="메시지를 입력하세요..." />
        <TouchableOpacity>
          <Ionicons name="send" size={24} color="#7A4DFF" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  online: {
    fontSize: 12,
    color: 'green',
  },
  chatArea: {
    padding: 16,
  },
  botMessage: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  keywordBox: {
    backgroundColor: '#FFF9E2',
    padding: 12,
    borderRadius: 8,
  },
  keywordTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  keywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  keywordChip: {
    backgroundColor: '#FFE15C',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  keywordText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bullet: {
    fontSize: 13,
    marginBottom: 2,
  },
  continueButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  continueText: {
    color: '#C27A00',
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagPurple: {
    backgroundColor: '#F1E7FF',
  },
  tagBlue: {
    backgroundColor: '#E0ECFF',
  },
  tagGreen: {
    backgroundColor: '#D9F5E5',
  },
  tagText: {
    fontSize: 13,
  },
  userMessage: {
    backgroundColor: '#E7D6FF',
    borderRadius: 12,
    padding: 14,
    alignSelf: 'flex-end',
    marginBottom: 12,
    maxWidth: '90%',
  },
  userText: {
    fontSize: 14,
    color: '#2E0063',
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  quickButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 1,
  },
  quickText: {
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 12,
  },
})
