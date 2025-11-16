export function getCountryFromLocale(locale: string): string | null {
  try {
    const parts = locale.split('-');
    return parts.length > 1 ? parts[1].toUpperCase() : null;
  } catch {
    return null;
  }
}

export function getCurrencyFromLocale(locale: string): string | null {
  try {
    const currencyMap: Record<string, string> = {
      US: 'USD',
      GB: 'GBP',
      DE: 'EUR',
    };

    const country = getCountryFromLocale(locale);
    return country ? currencyMap[country] || null : null;
  } catch {
    return null;
  }
}

export function getLocaleInfo(locale: string): {
  country: string;
  currency: string;
} {
  return {
    country: getCountryFromLocale(locale) || 'US',
    currency: getCurrencyFromLocale(locale) || 'USD',
  };
}
