import {translations} from './translations';
import store from '../store';

export const LANGUAGES = {
  TR: {
    value: 'tr',
    name: 'Türkçe', // TODO - replace with icon
  },
  EN: {
    value: 'en',
    name: 'English', // TODO - replace with icon
  },
};

class I18nService {
  constructor() {
    this.translations = translations;
    this.currentLanguage = LANGUAGES.EN.value;
    // eslint-disable-next-line no-undef
    this.listeners = new Set();

    // Initialize with store's language if available
    const initialState = store.getState();
    if (initialState.language) {
      this.currentLanguage = initialState.language;
    }

    // Subscribe to store language changes
    store.subscribe((state) => {
      if (state.language !== this.currentLanguage) {
        this.setLanguage(state.language);
      }
    });
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.currentLanguage));
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      document.documentElement.lang = lang;
      this.notify();
    }
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value;
  }

  // Helper method for interpolating variables in translations
  tFormat(key, variables = {}) {
    let text = this.t(key);
    Object.entries(variables).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, value);
    });
    return text;
  }
}

const i18n = new I18nService();
export default i18n;
