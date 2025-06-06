import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

interface StorageInterface {
  getItem<T>(key: string): Promise<T | null>
  setItem<T>(key: string, value: T): Promise<void>
  removeItem(key: string): Promise<void>
  clear(): Promise<void>
}

class Storage implements StorageInterface {
  private getStorage() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      return localStorage
    }
    return AsyncStorage
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const storage = this.getStorage()
      const value = await storage.getItem(key)

      if (!value) return null

      return JSON.parse(value) as T
    } catch (error) {
      console.error('Storage getItem error:', error)
      return null
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const storage = this.getStorage()
      const stringValue = JSON.stringify(value)
      await storage.setItem(key, stringValue)
    } catch (error) {
      console.error('Storage setItem error:', error)
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const storage = this.getStorage()
      await storage.removeItem(key)
    } catch (error) {
      console.error('Storage removeItem error:', error)
    }
  }

  async clear(): Promise<void> {
    try {
      const storage = this.getStorage()
      await storage.clear()
    } catch (error) {
      console.error('Storage clear error:', error)
    }
  }
}

export const storage = new Storage()

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PROFILE: 'user_profile',
  SETTINGS: 'settings',
  LANGUAGE: 'language',
} as const
