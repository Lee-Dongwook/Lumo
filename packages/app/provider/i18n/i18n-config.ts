import { I18n } from 'i18n-js'
import { en } from './translations/en'
import { ko } from './translations/ko'

export interface TranslationOptions {
  userName?: string
  [key: string]: any
}

export type Namespace = 'common' | 'home' | 'profile' | 'settings'

export const LANGUAGES = {
  en: 'English',
  ko: '한국어',
} as const

export type LanguageKey = keyof typeof LANGUAGES

export interface TranslationKeys {
  [key: string]: string | TranslationKeys
}

export function initializeI18n() {
  const i18n = new I18n()

  i18n.translations = {
    ko,
    en,
  }

  const locale = 'ko'

  i18n.enableFallback = true
  i18n.defaultLocale = 'ko'

  // eslint-disable-next-line no-undef
  if (__DEV__) {
    // console.log('Available translations:', i18n.translations)
    console.log('Current locale:', i18n.locale)
    console.log('Default locale:', i18n.defaultLocale)
  }

  return i18n
}
