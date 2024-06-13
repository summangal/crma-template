import 'react-i18next';
import en from './en/index';

declare module 'react-i18next' {
  interface Resources {
    en: typeof en;
  }
}
