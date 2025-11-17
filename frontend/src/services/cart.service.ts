import { fetcher, postFetcher } from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import { Cart, ShippingMethod } from '@shared/cart';
import { ApiResponse } from '@shared/index';
import { silentMutateOptions } from '@/utils/swr-options';
import { useLocale } from '@/contexts/LocaleContext';

const CART_KEY = '/v1/carts';

// Get cart with SWR for client-side data fetching
export const useCart = () => {
  const { locale } = useLocale();
  const {
    data,
    error,
    isLoading,
    mutate: mutateCart,
  } = useSWR<ApiResponse<Cart>>(
    [CART_KEY, locale],
    ([url]) =>
      fetcher<ApiResponse<Cart>>(url, undefined, { 'Accept-Language': locale }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );
  const cart = data?.data;
  return {
    cart: cart,
    count: cart?.totalLineItemQuantity || 0,
    isLoading,
    error,
    mutate: mutateCart,
  };
};

// Add to cart with optimistic UI updates
export const addToCart = async (
  sku: string,
  quantity: number = 1,
  locale: string
): Promise<ApiResponse<Cart>> => {
  try {
    const response = await postFetcher<ApiResponse<Cart>>(
      `${CART_KEY}/addToCart`,
      { sku, quantity },
      { 'Accept-Language': locale }
    );

    // Only mutate cache if successful
    if (response.success && response.data) {
      await mutate([CART_KEY, locale], response, silentMutateOptions);
    }

    return response;
  } catch (error: any) {
    console.error('Failed to add item to cart:', error);
    return {
      success: false,
      error: {
        message: error?.message || 'Failed to add item to cart',
      },
    };
  }
};

// Apply discount code to cart
export const applyDiscountCode = async (
  code: string,
  locale: string
): Promise<ApiResponse<Cart>> => {
  try {
    const response = await postFetcher<ApiResponse<Cart>>(
      `${CART_KEY}/discount/apply`,
      { code },
      { 'Accept-Language': locale }
    );

    // Only mutate cache if successful
    if (response.success && response.data) {
      await mutate([CART_KEY, locale], response, silentMutateOptions);
    }

    return response;
  } catch (error: any) {
    console.error('Failed to apply discount code:', error);
    return {
      success: false,
      error: {
        message: error?.message || 'Failed to apply discount code',
      },
    };
  }
};

// Remove discount code from cart
export const removeDiscountCode = async (
  discountCodeId: string,
  locale: string
): Promise<ApiResponse<Cart>> => {
  try {
    const response = await postFetcher<ApiResponse<Cart>>(
      `${CART_KEY}/discount/remove`,
      { discountCodeId },
      { 'Accept-Language': locale }
    );

    // Only mutate cache if successful
    if (response.success && response.data) {
      await mutate([CART_KEY, locale], response, silentMutateOptions);
    }

    return response;
  } catch (error: any) {
    console.error('Failed to remove discount code:', error);
    return {
      success: false,
      error: {
        message: error?.message || 'Failed to remove discount code',
      },
    };
  }
};

// Update cart addresses
export const updateCartAddresses = async (
  address: any,
  locale: string
): Promise<ApiResponse<Cart>> => {
  try {
    const response = await postFetcher<ApiResponse<Cart>>(
      `${CART_KEY}/addresses`,
      { address },
      { 'Accept-Language': locale }
    );

    // Only mutate cache if successful
    if (response.success && response.data) {
      await mutate([CART_KEY, locale], response, silentMutateOptions);
    }

    return response;
  } catch (error: any) {
    console.error('Failed to update addresses:', error);
    return {
      success: false,
      error: {
        message: error?.message || 'Failed to update addresses',
      },
    };
  }
};

// Remove line item from cart
export const removeLineItem = async (
  lineItemId: string,
  locale: string
): Promise<ApiResponse<Cart>> => {
  try {
    const response = await postFetcher<ApiResponse<Cart>>(
      `${CART_KEY}/removeLineItem`,
      { lineItemId },
      { 'Accept-Language': locale }
    );

    // Only mutate cache if successful
    if (response.success && response.data) {
      await mutate([CART_KEY, locale], response, silentMutateOptions);
    }

    return response;
  } catch (error: any) {
    console.error('Failed to remove line item:', error);
    return {
      success: false,
      error: {
        message: error?.message || 'Failed to remove line item',
      },
    };
  }
};

// Get eligible shipping methods for cart
export const useShippingMethods = () => {
  const { locale } = useLocale();
  const { data, error, isLoading } = useSWR<ApiResponse<ShippingMethod[]>>(
    ['/v1/carts/shipping-methods', locale],
    ([url]) =>
      fetcher<ApiResponse<ShippingMethod[]>>(url, undefined, {
        'Accept-Language': locale,
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  return {
    shippingMethods: data?.data || [],
    isLoading,
    error,
  };
};

// Set shipping method for cart
export const setShippingMethod = async (
  shippingMethodId: string,
  locale: string
): Promise<ApiResponse<Cart>> => {
  try {
    const response = await postFetcher<ApiResponse<Cart>>(
      `${CART_KEY}/shipping-method`,
      { shippingMethodId },
      { 'Accept-Language': locale }
    );

    // Only mutate cache if successful
    if (response.success && response.data) {
      await mutate([CART_KEY, locale], response, silentMutateOptions);
    }

    return response;
  } catch (error: any) {
    console.error('Failed to set shipping method:', error);
    return {
      success: false,
      error: {
        message: error?.message || 'Failed to set shipping method',
      },
    };
  }
};
