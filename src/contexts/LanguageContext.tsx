
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

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Load all translation modules when language changes
    const loadTranslations = async () => {
      try {
        const modules = [
          'navigation',
          'hero', 
          'leadership-roles',
          'coaching-approach',
          'retreat',
          'common',
          'about',
          'case-studies',
          'client-assessment'
        ];

        const loadedTranslations: Record<string, any> = {};

        for (const module of modules) {
          try {
            const response = await import(`../i18n/${language}/${module}.json`);
            // Store each module under its own key to preserve structure
            loadedTranslations[module.replace('-', '_')] = response.default;
          } catch (error) {
            console.warn(`Failed to load translation module: ${module}`, error);
          }
        }

        // Also merge common module content directly for backward compatibility
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
    
    // Ensure we always return a string
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
