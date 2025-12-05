'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

  if (!mounted) {
    return (
      <div style={{ position: 'relative' }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer'
        }}>
          <span style={{ fontSize: '24px' }}>🇬🇧</span>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>EN</span>
        </button>
      </div>
    );
  }

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', code);
    }
    if (code === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 50 }}>
      {/* Button */}
      <button
        onClick={() => {
          console.log('Button clicked, isOpen will be:', !isOpen);
          setIsOpen(!isOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        <span style={{ fontSize: '24px' }}>{currentLanguage.flag}</span>
        <span>{currentLanguage.code.toUpperCase()}</span>
        <span style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s'
        }}>▼</span>
      </button>

      {/* Dropdown - Using Portal to render at document body level */}
      {mounted && isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={() => {
              console.log('Backdrop clicked, closing dropdown');
              setIsOpen(false);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999999,
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }}
          />

          {/* Dropdown Menu */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              maxWidth: '400px',
              backgroundColor: '#ffffff',
              border: '8px solid #FFC800',
              borderRadius: '16px',
              overflow: 'hidden',
              zIndex: 9999999,
              boxShadow: '0 40px 80px rgba(0, 0, 0, 0.9)'
            }}
          >
            {/* Header */}
            <div style={{
              backgroundColor: '#FFC800',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                color: '#000000',
                fontSize: '16px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                🌍 SELECT LANGUAGE
              </div>
            </div>

            {/* English */}
            <button
              onClick={() => changeLanguage('en')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: currentLanguage.code === 'en' ? '#FFC800' : '#000000',
                color: currentLanguage.code === 'en' ? '#000000' : '#FFFFFF',
                border: 'none',
                borderBottom: '2px solid rgba(255, 200, 0, 0.3)',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '40px' }}>🇬🇧</span>
              <div style={{ flex: 1 }}>
                <div>English</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>EN</div>
              </div>
              {currentLanguage.code === 'en' && <span style={{ fontSize: '28px' }}>✓</span>}
            </button>

            {/* French */}
            <button
              onClick={() => changeLanguage('fr')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: currentLanguage.code === 'fr' ? '#FFC800' : '#000000',
                color: currentLanguage.code === 'fr' ? '#000000' : '#FFFFFF',
                border: 'none',
                borderBottom: '2px solid rgba(255, 200, 0, 0.3)',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '40px' }}>🇫🇷</span>
              <div style={{ flex: 1 }}>
                <div>Français</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>FR</div>
              </div>
              {currentLanguage.code === 'fr' && <span style={{ fontSize: '28px' }}>✓</span>}
            </button>

            {/* Arabic */}
            <button
              onClick={() => changeLanguage('ar')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: currentLanguage.code === 'ar' ? '#FFC800' : '#000000',
                color: currentLanguage.code === 'ar' ? '#000000' : '#FFFFFF',
                border: 'none',
                borderBottom: '2px solid rgba(255, 200, 0, 0.3)',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '40px' }}>🇸🇦</span>
              <div style={{ flex: 1 }}>
                <div>العربية</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>AR</div>
              </div>
              {currentLanguage.code === 'ar' && <span style={{ fontSize: '28px' }}>✓</span>}
            </button>

            {/* Italian */}
            <button
              onClick={() => changeLanguage('it')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: currentLanguage.code === 'it' ? '#FFC800' : '#000000',
                color: currentLanguage.code === 'it' ? '#000000' : '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '40px' }}>🇮🇹</span>
              <div style={{ flex: 1 }}>
                <div>Italiano</div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>IT</div>
              </div>
              {currentLanguage.code === 'it' && <span style={{ fontSize: '28px' }}>✓</span>}
            </button>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
