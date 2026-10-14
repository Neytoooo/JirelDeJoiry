'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, TRANSLATIONS } from '@/data/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const STORAGE_LANG_KEY = 'jirel_site_language_v1';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLangState] = useState<Language>('fr');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_LANG_KEY) as Language;
      if (savedLang === 'fr' || savedLang === 'en') {
        setLangState(savedLang);
      }
    } catch (e) {
      console.warn('Erreur lecture langue:', e);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, newLang);
      // Ajuster l'attribut lang du HTML
      if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
      }
    } catch (e) {
      console.warn('Erreur sauvegarde langue:', e);
    }
  };

  const t = TRANSLATIONS[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'fr',
      setLang: () => {},
      t: TRANSLATIONS.fr,
    };
  }
  return context;
};
