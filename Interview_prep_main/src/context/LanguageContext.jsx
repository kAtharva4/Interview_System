// src/context/LanguageContext.jsx
import { createContext, useContext, useState } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('selectedLanguage') || 'en'
  );

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// This is the correct way to export the hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}