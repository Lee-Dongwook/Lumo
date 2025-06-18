import { Provider } from 'app/provider'
import { Stack } from 'expo-router'
import {
  SafeAreaView,
  StyleSheet,
  AppState,
  Linking,
  Alert,
} from 'react-native'
import 'expo-app/global.css'
import * as Notifications from 'expo-notifications'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import Constants from 'expo-constants'

export default function Root() {
  return (
    <Provider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </SafeAreaView>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})
