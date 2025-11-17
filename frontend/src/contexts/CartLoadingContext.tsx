'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartLoadingContextType {
  isCartLoading: boolean;
  setCartLoading: (loading: boolean) => void;
}

const CartLoadingContext = createContext<CartLoadingContextType | undefined>(
  undefined
);

export function CartLoadingProvider({ children }: { children: ReactNode }) {
  const [isCartLoading, setIsCartLoading] = useState(false);

  const setCartLoading = (loading: boolean) => {
    setIsCartLoading(loading);
  };

  return (
    <CartLoadingContext.Provider value={{ isCartLoading, setCartLoading }}>
      {children}
      {isCartLoading && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
        </div>
      )}
    </CartLoadingContext.Provider>
  );
}

export function useCartLoading() {
  const context = useContext(CartLoadingContext);
  if (context === undefined) {
    throw new Error('useCartLoading must be used within CartLoadingProvider');
  }
  return context;
}
