'use client';

import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';

export function I18nProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Update document language and direction
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return <>{children}</>;
}
