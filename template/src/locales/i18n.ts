import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/index';

const resources = {
  en,
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
  })
  .catch(err => {
    console.error(
      `Failed to initialize i18n service: ${err.message as string}`,
    );
  });

export default i18n;
