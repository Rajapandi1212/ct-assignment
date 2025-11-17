import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingOverlay from '@/components/LoadingOverlay';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { LocaleProvider } from '@/contexts/LocaleContext';

export const metadata: Metadata = {
  title: 'Fullstack App',
  description: 'Next.js + Express Monorepo',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the initial locale from the cookie on the server
  const cookieStore = await cookies();
  const initialLocale = (cookieStore.get('NEXT_LOCALE')?.value || 'en-US') as
    | 'en-US'
    | 'en-GB'
    | 'de-DE';

  return (
    <html lang={initialLocale.split('-')[0]}>
      <body className="flex flex-col min-h-screen max-w-[1600px] mx-auto">
        <LoadingProvider>
          <LocaleProvider initialLocale={initialLocale}>
            <LoadingOverlay />
            <Header />
            <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8">
              {children}
            </main>
            <Footer />
          </LocaleProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
