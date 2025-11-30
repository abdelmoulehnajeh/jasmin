'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function useClientTranslation() {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a safe translation function that returns English during SSR/hydration
  const safeT = (key: string) => {
    if (!mounted) {
      // During SSR/hydration, force English to match server-rendered content
      const prevLang = i18n.language;
      const result = i18n.t(key, { lng: 'en' });
      return result;
    }
    return t(key);
  };

  return { t: safeT, i18n, mounted };
}
