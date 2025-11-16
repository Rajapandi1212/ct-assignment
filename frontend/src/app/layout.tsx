import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingOverlay from '@/components/LoadingOverlay';
import { LoadingProvider } from '@/contexts/LoadingContext';

export const metadata: Metadata = {
  title: 'Fullstack App',
  description: 'Next.js + Express Monorepo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen max-w-[1600px] mx-auto">
        <LoadingProvider>
          <LoadingOverlay />
          <Header />
          <main className="flex-1 pt-16 px-4 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </LoadingProvider>
      </body>
    </html>
  );
}
