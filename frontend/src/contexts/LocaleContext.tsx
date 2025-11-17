'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type Locale = 'en-US' | 'en-GB' | 'de-DE';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({
  children,
  initialLocale = 'en-US',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isMounted, setIsMounted] = useState(false);

  // Set locale from cookie on client-side mount
  useEffect(() => {
    const storedLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] as Locale | undefined;

    if (storedLocale) {
      setLocaleState(storedLocale);
    }
    setIsMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    // Update cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setLocaleState(newLocale);
  };

  // Don't render children until we've read the locale from the cookie
  if (!isMounted) {
    return null;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
