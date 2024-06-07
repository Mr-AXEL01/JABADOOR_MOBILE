import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import ar from '../locales/ar.json';

export const languageResources = {
    en: {translations: en},
    fr: {translations: fr},
    ar: {translations: ar},
}

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lang: 'en',
    fallbackling: 'en',
    resources: languageResources,
});

export default i18next;