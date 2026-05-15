'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface LanguageContextType {
  isEnglish: boolean;
  setIsEnglish: (value: boolean) => void;
  toggleLanguage: () => void;
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectDefaultLanguage(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  return !window.location.pathname.startsWith('/zh');
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [isEnglish, setIsEnglishState] = useState(detectDefaultLanguage);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsEnglishState(detectDefaultLanguage());
    setIsInitialized(true);
  }, []);

  const handleSetIsEnglish = useCallback((value: boolean) => {
    setIsEnglishState(value);
    localStorage.setItem('language', value ? 'en' : 'zh');
  }, []);

  const toggleLanguage = useCallback(() => {
    handleSetIsEnglish(!isEnglish);
  }, [handleSetIsEnglish, isEnglish]);

  const value = useMemo(
    () => ({
      isEnglish,
      setIsEnglish: handleSetIsEnglish,
      toggleLanguage,
      isInitialized,
    }),
    [handleSetIsEnglish, isEnglish, isInitialized, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useLanguage_v2() {
  const { isEnglish, setIsEnglish, toggleLanguage } = useLanguage();
  return { isEnglish, setIsEnglish, toggleLanguage };
}
