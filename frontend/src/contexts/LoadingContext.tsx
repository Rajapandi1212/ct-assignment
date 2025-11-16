'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useTransition,
} from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface LoadingContextType {
  isPending: boolean;
  navigate: (url: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (url: string) => {
    startTransition(() => {
      router.push(url, { scroll: false });
    });
  };

  return (
    <LoadingContext.Provider value={{ isPending, navigate }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
