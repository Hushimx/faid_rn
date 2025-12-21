import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import ar from './ar.json';
import en from './en.json';

import { initReactI18next } from 'react-i18next';
import { LANGUAGES_ENUM } from 'types';
import {
  appChangeLangaugeHandler,
  getCurrentDeviceLanguage,
  getStoredAppLannguae,
} from 'utils';

// Define the type for supported languages
export type TranslationKeys = keyof typeof en;

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async () => {
    const lang = await getStoredAppLannguae();

    const deviceLang = getCurrentDeviceLanguage();

    if (lang === null) {
      appChangeLangaugeHandler(deviceLang as LANGUAGES_ENUM);
      return deviceLang;
    } else {
      return lang;
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
// Initialize i18next
i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    compatibilityJSON: 'v4',

    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
