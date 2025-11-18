'use client';

import { createContext, useContext, ReactNode } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { ApiResponse } from '@shared/index';
import { User } from '@shared/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<User>>(
    '/v1/customers/me',
    (url) => fetcher<ApiResponse<User>>(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      onError: () => {
        // User not authenticated - this is fine
      },
    }
  );

  const user = data?.success && data?.data ? data.data : null;

  return (
    <AuthContext.Provider value={{ user, isLoading, error, mutate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
