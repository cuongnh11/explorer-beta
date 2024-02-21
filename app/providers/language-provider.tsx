'use client';

import localeEn from '@locales/en';
import localeVi from '@locales/vi';
import { toLower } from 'lodash';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface Translations {
    [key: string]: string;
}

interface LanguageContextProps {
    t: (key: string, replacements?: Record<string, string | number>) => string;
    changeLanguage: (newLanguage: 'en' | 'vi') => void;
    language: string;
}

const translations: Record<string, Translations> = {
    en: localeEn,
    vi: localeVi,
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const localLang = toLower(localStorage.getItem('lang') || 'en');
        if (['en', 'vi'].includes(localLang)) {
            return localLang;
        }
        return 'en';
    });

    const t: LanguageContextProps['t'] = (key, replacements) => {
        let text = translations?.[language]?.[key] || key;

        if (replacements) {
            Object.entries(replacements).forEach(([replaceKey, replaceValue]) => {
                const replaceRegex = new RegExp(`{{${replaceKey}}}`, 'g');
                text = text.replace(replaceRegex, String(replaceValue));
            });
        }

        return text;
    };

    const changeLanguage: LanguageContextProps['changeLanguage'] = newLanguage => {
        localStorage.setItem('lang', newLanguage);
        setLanguage(newLanguage);
    };

    const contextValue: LanguageContextProps = {
        changeLanguage,
        language,
        t,
    };

    return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextProps => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
