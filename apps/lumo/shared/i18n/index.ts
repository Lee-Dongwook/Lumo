import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'

import ko from './locales/ko.json'
import en from './locales/en.json'

const resources = {
  ko: { translation: ko },
  en: { translation: en },
}

const fallbackLng = 'ko'

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lang: string) => void) => {
    const locales = Localization.getLocales()
    if (Array.isArray(locales)) {
      callback(locales[0].languageTag)
    } else {
      callback(fallbackLng)
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
}

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n 