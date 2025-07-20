import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'

interface CurriCulumRenderOption {
  mode: 'single' | 'curriculum'
  title: string
  description: string
  bulletPoints: string[]
  emoji: string
}

const options: Record<CurriCulumRenderOption['mode'], CurriCulumRenderOption> =
  {
    single: {
      mode: 'single',
      title: '일회성 학습',
      description: '간단하게 한 번만 배우고 싶을 때',
      bulletPoints: ['빠른 학습', '핵심 내용 위주'],
      emoji: '⚡️',
    },
    curriculum: {
      mode: 'curriculum',
      title: '커리큘럼 학습',
      description: '여러 회차로 깊이 있게 배우고 싶을 때',
      bulletPoints: ['단계별 학습', '심화 내용 포함'],
      emoji: '📚',
    },
  }

export default function CurriculumScreen() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<
    CurriCulumRenderOption['mode'] | null
  >(null)

  console.log(selectedMode)

  const handleNext = () => {
    if (selectedMode === 'single') {
      router.push('/curriculum/single')
    } else if (selectedMode === 'curriculum') {
      router.push('/curriculum/double')
    } else {
      Alert.alert('학습 방식을 선택해주세요')
    }
  }

  const renderOption = ({
    mode,
    title,
    description,
    bulletPoints,
    emoji,
  }: CurriCulumRenderOption) => {
    const isSelected = selectedMode === mode

    return (
      <TouchableOpacity
        style={[styles.optionContainer, isSelected && styles.optionSelected]}
        onPress={() => setSelectedMode(mode)}
      >
        <View style={styles.optionHeader}>
          {emoji}
          <Text style={styles.optionTitle}>{title}</Text>
        </View>
        <Text style={styles.optionDescription}>{description}</Text>
        {bulletPoints.map((point, idx) => (
          <Text key={idx} style={styles.bulletPoint}>
            • {point}
          </Text>
        ))}
        <View
          style={[styles.radioCircle, isSelected && styles.radioSelected]}
        />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>학습 방식 선택</Text>
        </View>
        {/* Center Icon */}
        <View style={styles.centerIcon}>
          <Image
            source={require('@/assets/images/Lumo.png')}
            style={styles.iconImage}
          />
        </View>
        {/* Title */}
        <Text style={styles.title}>어떤 방식으로 학습을 진행할까요?</Text>
        <Text style={styles.subtitle}>
          학습 목적에 맞는 방식을 선택해주세요
        </Text>

        {/* Options */}

        {renderOption(options.single)}
        {renderOption(options.curriculum)}

        {/* Footer Note */}
        <Text style={styles.infoText}>
          ⓘ 언제든지 설정에서 학습 방식을 변경할 수 있어요. 처음에는 편한
          방식으로 시작해보세요!
        </Text>
        {/* Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedMode && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!selectedMode}
        >
          <Text style={styles.nextButtonText}>다음으로</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerIcon: {
    marginVertical: 16,
  },
  iconImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  optionSelected: {
    borderColor: '#007aff',
    backgroundColor: '#e6f0ff',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 13,
    color: '#555',
    marginLeft: 12,
  },
  radioCircle: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  radioSelected: {
    borderColor: '#007aff',
    backgroundColor: '#007aff',
  },
  emoji: {
    fontSize: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
})
