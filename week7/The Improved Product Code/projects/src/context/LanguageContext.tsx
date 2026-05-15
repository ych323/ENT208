'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  isEnglish: boolean;
  setIsEnglish: (value: boolean) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [isEnglish, setIsEnglish] = useState(false);

  // 从 localStorage 读取语言设置
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setIsEnglish(storedLanguage === 'en');
    } else {
      // 默认根据路径判断
      const path = window.location.pathname;
      setIsEnglish(path.startsWith('/en'));
    }
  }, []);

  // 保存语言设置到 localStorage
  const handleSetIsEnglish = (value: boolean) => {
    setIsEnglish(value);
    localStorage.setItem('language', value ? 'en' : 'zh');
  };

  const toggleLanguage = () => {
    handleSetIsEnglish(!isEnglish);
  };

  return (
    <LanguageContext.Provider value={{
      isEnglish,
      setIsEnglish: handleSetIsEnglish,
      toggleLanguage,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
