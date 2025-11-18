import { postFetcher } from '@/lib/fetcher';
import { mutate } from 'swr';
import { ApiResponse } from '@shared/index';
import { User } from '@shared/user';
import { Cart } from '@shared/cart';
import { silentMutateOptions } from '@/utils/swr-options';

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  customer: User;
  cart?: Cart;
}

export const signUp = async (
  data: SignUpData,
  locale: string
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await postFetcher<ApiResponse<AuthResponse>>(
      '/v1/customers/signup',
      data,
      { 'Accept-Language': locale }
    );

    // Mutate user and cart data silently on success
    if (response.success && response.data) {
      await mutate(
        '/v1/customers/me',
        { success: true, data: response.data.customer },
        silentMutateOptions
      );

      if (response.data.cart) {
        await mutate(
          ['/v1/carts', locale],
          { success: true, data: response.data.cart },
          silentMutateOptions
        );
      }
    }

    return response;
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error?.message || 'Failed to sign up',
      },
    };
  }
};

export const signIn = async (
  data: SignInData,
  locale: string
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const response = await postFetcher<ApiResponse<AuthResponse>>(
      '/v1/customers/signin',
      data,
      { 'Accept-Language': locale }
    );

    // Mutate user and cart data silently on success
    if (response.success && response.data) {
      await mutate(
        '/v1/customers/me',
        { success: true, data: response.data.customer },
        silentMutateOptions
      );

      if (response.data.cart) {
        await mutate(
          ['/v1/carts', locale],
          { success: true, data: response.data.cart },
          silentMutateOptions
        );
      }
    }

    return response;
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error?.message || 'Failed to sign in',
      },
    };
  }
};

export const signOut = async (locale: string): Promise<ApiResponse<any>> => {
  try {
    const response = await postFetcher<ApiResponse<any>>(
      '/v1/customers/signout',
      {},
      { 'Accept-Language': locale }
    );

    // Clear user and cart data on success
    if (response.success) {
      await mutate('/v1/customers/me', null, silentMutateOptions);
      await mutate(['/v1/carts', locale], undefined);
    }

    return response;
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error?.message || 'Failed to sign out',
      },
    };
  }
};
