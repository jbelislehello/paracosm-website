import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

const TRANSLATION_MODULES = [
  'navigation',
  'hero',
  'leadership-roles',
  'coaching-approach',
  'retreat',
  'common',
  'about',
  'case-studies',
  'client-assessment',
  'landing',
  'book',
  'summer-deal',
] as const;


export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const settledModules = await Promise.allSettled(
          TRANSLATION_MODULES.map(async (moduleName) => {
            const response = await import(`../i18n/${language}/${moduleName}.json`);
            return {
              key: moduleName.replace('-', '_'),
              value: response.default,
            };
          })
        );

        const loadedTranslations: Record<string, any> = {};

        settledModules.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            loadedTranslations[result.value.key] = result.value.value;
          } else {
            console.warn(`Failed to load translation module: ${TRANSLATION_MODULES[index]}`, result.reason);
          }
        });

        if (loadedTranslations.common) {
          Object.assign(loadedTranslations, loadedTranslations.common);
        }

        setTranslations(loadedTranslations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
