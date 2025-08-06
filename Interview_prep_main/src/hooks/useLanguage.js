// src/hooks/useLanguage.js
import { createContext, useContext, useState, useEffect } from 'react';
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

export function useLanguage() {
  return useContext(LanguageContext);
}

export { LanguageContext };