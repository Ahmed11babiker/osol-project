// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './i18n/ar.json';
import en from './i18n/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: 'ar', // اللغة الافتراضية
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
