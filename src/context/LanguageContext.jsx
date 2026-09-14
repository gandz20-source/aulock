import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import esDict from '../locales/es.json';
import enDict from '../locales/en.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = localStorage.getItem('aulock_language');
        if (saved === 'es' || saved === 'en') return saved;
      }
      if (typeof navigator !== 'undefined' && navigator.language) {
        return navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
      }
    } catch (e) {
      console.warn('Could not read saved language, defaulting to es:', e);
    }
    return 'es';
  });

  const setLanguage = useCallback((newLang) => {
    const valid = newLang === 'en' ? 'en' : 'es';
    setLanguageState(valid);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('aulock_language', valid);
        window.dispatchEvent(new CustomEvent('aulock_language_changed', { detail: valid }));
      }
    } catch (e) {
      console.warn('Could not persist language:', e);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'es' ? 'en' : 'es');
  }, [language, setLanguage]);

  /**
   * Helper function to translate a dot-separated key with optional string interpolation
   * Example: t('landing.hero.title_main')
   * Example with params: t('welcome_user', { name: 'Juan' })
   */
  const t = useCallback((keyPath, params = {}) => {
    if (!keyPath) return '';
    const keys = keyPath.split('.');
    
    // Choose primary dictionary based on active language
    const primaryDict = language === 'en' ? enDict : esDict;
    const fallbackDict = esDict;

    let value = keys.reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : undefined, primaryDict);
    
    // Fallback to Spanish dictionary if key is missing in English
    if (value === undefined && language === 'en') {
      value = keys.reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : undefined, fallbackDict);
    }

    if (value === undefined) {
      return keyPath;
    }

    if (typeof value !== 'string') {
      return value;
    }

    // Interpolate {param} if parameters provided
    if (params && typeof params === 'object' && Object.keys(params).length > 0) {
      return Object.entries(params).reduce((str, [k, v]) => {
        return str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }, value);
    }

    return value;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isEn: language === 'en' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
