import { fetcher, postFetcher } from '@/lib/fetcher';
import useSWR, { mutate } from 'swr';
import { Cart, CartResponse, LineItem } from '@shared/cart';
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
  } = useSWR<CartResponse>(
    [CART_KEY, locale],
    ([url]) =>
      fetcher<CartResponse>(url, undefined, { 'Accept-Language': locale }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );
  const cart = data?.data;
  return {
    cart: cart,
    count:
      cart?.lineItems.reduce(
        (sum: number, item: LineItem) => sum + (item.quantity || 0),
        0
      ) || 0,
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
): Promise<Cart> => {
  try {
    const response = await postFetcher<CartResponse>(
      `${CART_KEY}/addToCart`,
      { sku, quantity },
      { 'Accept-Language': locale }
    );

    // Only mutate cache after successful API call
    await mutate([CART_KEY, locale], response, silentMutateOptions);

    return response.data;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw error;
  }
};
