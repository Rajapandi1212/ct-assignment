'use client';

import Link from 'next/link';
import { useState } from 'react';
import LocaleSwitcher from './LocaleSwitcher';
import AuthModal from './AuthModal';
import { useCart } from '@/services/cart.service';

export default function Header() {
  const { count } = useCart();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  return (
    <header className="bg-gradient-to-r from-primary-600 to-secondary-600 fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1600px] z-50 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
                <span className="text-white font-display font-bold text-xl">
                  RP
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <LocaleSwitcher />

            <Link
              href="/checkout"
              className="relative text-white hover:text-neutral-200 transition-colors"
              aria-label="Cart"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {count > 0 ? (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {count}
                </span>
              ) : null}
            </Link>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-white hover:text-neutral-200 transition-colors"
              aria-label="Account"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </header>
  );
}
