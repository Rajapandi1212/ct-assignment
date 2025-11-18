import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingOverlay from '@/components/LoadingOverlay';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { LocaleProvider } from '@/contexts/LocaleContext';
import { CartLoadingProvider } from '@/contexts/CartLoadingContext';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'RP Shopping - Your One-Stop Online Store',
  description:
    'Discover amazing products at great prices on RP Shopping. Shop now for the latest trends in fashion, electronics, home goods, and more.',
  keywords: [
    'shopping',
    'ecommerce',
    'online store',
    'RP Shopping',
    'fashion',
    'electronics',
    'home goods',
  ],
  authors: [{ name: 'RP' }],
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
            <AuthProvider>
              <CartLoadingProvider>
                <LoadingOverlay />
                <Header />
                <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8">
                  {children}
                </main>
                <Footer />
              </CartLoadingProvider>
            </AuthProvider>
          </LocaleProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
