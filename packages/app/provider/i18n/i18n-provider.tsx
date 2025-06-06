import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from 'react'
import { I18n } from 'i18n-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  initializeI18n,
  LanguageKey,
  Namespace,
  TranslationKeys,
  TranslationOptions,
} from './i18n-config'

interface I18nContextType {
  t: (
    key: string,
    options?: TranslationOptions | string,
    namespace?: Namespace,
  ) => string
  locale: string
  setLocale: (language: LanguageKey) => void
  instance: I18n
}

const LANGUAGE_KEY = '@app_language'

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const i18nInstance = useMemo(() => initializeI18n(), [])

  // Load saved language on mount
  useEffect(() => {
    async function loadSavedLanguage() {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY)
        if (savedLanguage) {
          i18nInstance.locale = savedLanguage as LanguageKey
        } else {
          i18nInstance.locale = 'ko'
        }
      } catch (error) {
        console.error('Failed to load language:', error)
      }
    }
    loadSavedLanguage()
  }, [i18nInstance])

  const setLocale = useCallback(
    async (language: LanguageKey) => {
      try {
        console.log('🔔 setLocale', language)
        await AsyncStorage.setItem(LANGUAGE_KEY, language)
        i18nInstance.locale = language
      } catch (error) {
        console.error('Failed to save language:', error)
      }
    },
    [i18nInstance],
  )

  const t = useCallback(
    (
      key: string,
      options?: TranslationOptions | string,
      namespace?: Namespace,
    ) => {
      const fullKey = namespace ? `${namespace}.${key}` : key
      return i18nInstance.t(
        fullKey,
        typeof options === 'string' ? undefined : options,
      )
    },
    [i18nInstance],
  )

  const value = useMemo(
    () => ({
      t,
      locale: i18nInstance.locale,
      setLocale,
      instance: i18nInstance,
    }),
    [t, i18nInstance, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
