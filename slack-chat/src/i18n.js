import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index';

const i18n = i18next.createInstance();
const options = {
  resources,
  fallbackLng: 'ru',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
};

await i18n
  .use(initReactI18next)
  .init(options);

export default i18n;
