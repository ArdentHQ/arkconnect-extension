import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';

import translation from './ns';

const defaultNS = 'translation';

const resources = {
    en: {
        translation,
    },
};

use(initReactI18next).init({
    defaultNS,
    lng: 'en',
    ns: [defaultNS],
    resources,
    returnNull: false,
});

export { defaultNS, resources };

export { default as i18n } from 'i18next';
