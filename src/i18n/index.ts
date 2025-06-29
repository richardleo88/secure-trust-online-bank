
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import it from './locales/it.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import th from './locales/th.json';
import vi from './locales/vi.json';
import tr from './locales/tr.json';
import pl from './locales/pl.json';
import nl from './locales/nl.json';
import sv from './locales/sv.json';
import da from './locales/da.json';
import no from './locales/no.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  pt: { translation: pt },
  ru: { translation: ru },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  ar: { translation: ar },
  hi: { translation: hi },
  th: { translation: th },
  vi: { translation: vi },
  tr: { translation: tr },
  pl: { translation: pl },
  nl: { translation: nl },
  sv: { translation: sv },
  da: { translation: da },
  no: { translation: no }
};

// Country to language mapping for location-based detection
const countryToLanguage: { [key: string]: string } = {
  // English-speaking countries
  'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en', 'ZA': 'en',
  // Spanish-speaking countries
  'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'PE': 'es', 'VE': 'es', 'CL': 'es',
  'EC': 'es', 'GT': 'es', 'CU': 'es', 'BO': 'es', 'DO': 'es', 'HN': 'es', 'PY': 'es',
  'SV': 'es', 'NI': 'es', 'CR': 'es', 'PA': 'es', 'UY': 'es',
  // French-speaking countries
  'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'CA': 'fr', 'LU': 'fr', 'MC': 'fr',
  // German-speaking countries
  'DE': 'de', 'AT': 'de', 'CH': 'de', 'LI': 'de',
  // Italian-speaking countries
  'IT': 'it', 'CH': 'it', 'SM': 'it', 'VA': 'it',
  // Portuguese-speaking countries
  'PT': 'pt', 'BR': 'pt', 'AO': 'pt', 'MZ': 'pt', 'GW': 'pt', 'CV': 'pt', 'ST': 'pt', 'TL': 'pt',
  // Russian-speaking countries
  'RU': 'ru', 'BY': 'ru', 'KZ': 'ru', 'KG': 'ru', 'TJ': 'ru',
  // Chinese-speaking countries/regions
  'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'SG': 'zh',
  // Japanese
  'JP': 'ja',
  // Korean
  'KR': 'ko',
  // Arabic-speaking countries
  'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'MA': 'ar', 'DZ': 'ar', 'TN': 'ar', 'LY': 'ar',
  'SD': 'ar', 'IQ': 'ar', 'SY': 'ar', 'JO': 'ar', 'LB': 'ar', 'KW': 'ar', 'QA': 'ar',
  'BH': 'ar', 'OM': 'ar', 'YE': 'ar',
  // Hindi
  'IN': 'hi',
  // Thai
  'TH': 'th',
  // Vietnamese
  'VN': 'vi',
  // Turkish
  'TR': 'tr',
  // Polish
  'PL': 'pl',
  // Dutch
  'NL': 'nl',
  // Swedish
  'SE': 'sv',
  // Danish
  'DK': 'da',
  // Norwegian
  'NO': 'no'
};

// Custom language detector that includes location-based detection
const customLanguageDetector = {
  name: 'customDetector',
  lookup: async (): Promise<string | undefined> => {
    // First, check if user has manually selected a language
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
      console.log('Using stored language:', storedLanguage);
      return storedLanguage;
    }

    // Try to detect location-based language
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const countryCode = data.country_code;
      const detectedLanguage = countryToLanguage[countryCode];
      
      if (detectedLanguage) {
        console.log('Detected country:', countryCode, 'Language:', detectedLanguage);
        return detectedLanguage;
      }
    } catch (error) {
      console.log('Location detection failed, falling back to browser detection');
    }

    // Fall back to browser language detection
    const browserLanguage = navigator.language.split('-')[0];
    if (Object.keys(resources).includes(browserLanguage)) {
      console.log('Using browser language:', browserLanguage);
      return browserLanguage;
    }

    // Default to English
    return 'en';
  },
  cacheUserLanguage: (lng: string) => {
    localStorage.setItem('preferredLanguage', lng);
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: ['customDetector', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'preferredLanguage'
    },
    interpolation: {
      escapeValue: false
    }
  });

// Add custom detector
i18n.services.languageDetector.addDetector(customLanguageDetector);

export default i18n;
