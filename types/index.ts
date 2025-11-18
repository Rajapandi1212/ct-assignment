export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// Re-export commonly used types
export type { Address } from './cart';
export type { User } from './user';