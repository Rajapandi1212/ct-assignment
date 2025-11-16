'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

type Locale = 'en-US' | 'en-GB' | 'de-DE';

const locales: { value: Locale; label: string; flag: string }[] = [
  { value: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { value: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  { value: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
];

export default function LocaleSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>('en-US');
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find((l) => l.value === locale) || locales[0];

  useEffect(() => {
    // Read locale from cookie after mount to avoid hydration mismatch
    const cookieLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] as Locale;
    setLocale(cookieLocale || 'en-US');
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);

    // Set Next.js locale cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    // Refresh to apply new locale
    router.refresh();
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="flex items-center space-x-2 text-white hover:text-neutral-200 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
          aria-label="Change language"
          disabled
        >
          <div className="w-6 h-6 bg-white/20 rounded animate-pulse"></div>
          <div className="hidden sm:inline w-12 h-4 bg-white/20 rounded animate-pulse"></div>
          <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-neutral-200 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
        aria-label="Change language"
      >
        <span className="text-xl">{currentLocale.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">{locale}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
          {locales.map((loc) => (
            <button
              key={loc.value}
              onClick={() => handleLocaleChange(loc.value)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 flex items-center space-x-3 ${
                locale === loc.value
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700'
              }`}
            >
              <span className="text-xl">{loc.flag}</span>
              <span>{loc.label}</span>
              {locale === loc.value && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
