import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { Audio } from 'expo-av'
import { useLocalSearchParams } from 'expo-router'
import { RTCPeerConnection, MediaStream } from 'react-native-webrtc'
import { socket, joinSocket } from '@/features/socket/socket'
import { createOffer, createAnswer } from '@/features/socket/signaling'
import { hangup } from '@/features/socket/call'

export default function CallScreen() {
  const { myId, targetId, isCaller } = useLocalSearchParams() as {
    myId: string
    targetId: string
    isCaller: string
  }

  const isCallerBool = isCaller === 'true'
  const [connected, setConnected] = useState(false)
  const [timer, setTimer] = useState(0)
  const [muted, setMuted] = useState(false)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const endCall = () => {
    if (pcRef.current) {
      hangup({
        pc: pcRef.current,
        localStream: localStreamRef.current,
        remoteStream: remoteStreamRef.current,
        myId,
        targetId,
      })
    }
    setConnected(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const startTimer = () => {
    timerRef.current = setInterval(
      () => setTimer((t) => t + 1),
      1000,
    ) as unknown as NodeJS.Timeout
  }

  useEffect(() => {
    joinSocket(myId)

    socket.on('tts_audio', async ({ url, text }) => {
      console.log('TTS 응답 수신:', text)
      const { sound } = await Audio.Sound.createAsync(
        {
          uri: `http://127.0.0.1:8000${url}`,
        },
        { shouldPlay: true },
      )
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          console.warn('🔴 TTS 재생 오류:', status)
        }
      })
    })

    if (isCallerBool) {
      createOffer({
        myId,
        targetId,
        onRemoteStream: (stream) => {
          remoteStreamRef.current = stream
          setConnected(true)
          startTimer()
        },
      }).then(({ pc, localStream }) => {
        pcRef.current = pc
        localStreamRef.current = localStream
      })
    } else {
      socket.on('offer', async ({ from, sdp }) => {
        const { pc, localStream } = await createAnswer({
          myId,
          targetId: from,
          offerSdp: sdp,
          onRemoteStream: (stream) => {
            remoteStreamRef.current = stream
            setConnected(true)
            startTimer()
          },
        })
        pcRef.current = pc
        localStreamRef.current = localStream
      })
    }

    return endCall
  }, [])

  const toggleMute = () => {
    const stream = localStreamRef.current
    if (!stream) return
    stream.getAudioTracks().forEach((track) => {
      track.enabled = muted
    })
    setMuted(!muted)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.statusText}>
        {connected
          ? `통화 중 · ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`
          : '연결 중...'}
      </Text>

      <View style={styles.avatar}>
        <Text style={styles.avatarEmoji}>🐰</Text>
        <Text style={styles.name}>AI 튜터</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={toggleMute} style={styles.button}>
          <Text style={styles.buttonText}>{muted ? '🔇' : '🎙️'}</Text>
          <Text style={styles.label}>{muted ? '음소거 해제' : '음소거'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={endCall}
          style={[styles.button, styles.hangupButton]}
        >
          <Text style={styles.buttonText}>📞</Text>
          <Text style={styles.label}>종료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  avatar: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarEmoji: {
    fontSize: 64,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 30,
  },
  button: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 100,
    backgroundColor: '#333',
  },
  hangupButton: {
    backgroundColor: '#d32f2f',
  },
  buttonText: {
    fontSize: 28,
  },
  label: {
    color: '#fff',
    marginTop: 6,
    fontSize: 12,
  },
})
