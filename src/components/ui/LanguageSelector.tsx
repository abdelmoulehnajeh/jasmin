'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="relative">
        <button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
          <span className="text-base sm:text-xl md:text-2xl">🇬🇧</span>
          <span className="text-white hidden md:inline text-xs sm:text-sm">English</span>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
    );
  }

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);

    // Store language preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', code);
    }

    // Update document direction for RTL languages
    if (code === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <span className="text-base sm:text-xl md:text-2xl">{currentLanguage.flag}</span>
          <span className="text-white hidden md:inline text-xs sm:text-sm">{currentLanguage.name}</span>
          <svg
            className={`w-3 h-3 sm:w-4 sm:h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>

      {/* Portal-style dropdown - rendered outside parent container */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown - positioned fixed to escape parent overflow */}
          <div
            className="fixed z-[70] w-48 bg-gray-800 rounded-lg shadow-2xl border border-gray-700"
            style={{
              top: typeof window !== 'undefined' ? `${window.scrollY + 60}px` : '60px',
              right: '1rem'
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors ${
                  lang.code === currentLanguage.code ? 'bg-gray-700' : ''
                } first:rounded-t-lg last:rounded-b-lg`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-white">{lang.name}</span>
                {lang.code === currentLanguage.code && (
                  <svg
                    className="w-5 h-5 text-[#FFC800] ml-auto"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
