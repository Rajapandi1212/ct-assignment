import { Product, Filter } from '@shared/product';
import { cookies } from 'next/headers';
import { fetcher, postFetcher } from '@/lib/fetcher';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  color?: string;
  finish?: string;
  newArrival?: boolean;
}

export interface ProductResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    facets: Filter[];
  };
}

async function getLocale(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('NEXT_LOCALE')?.value || 'en-US';
  } catch {
    return 'en-US';
  }
}

export const productService = {
  getProducts: async (
    params?: ProductQueryParams,
    locale?: string
  ): Promise<ProductResponse> => {
    const currentLocale = locale || (await getLocale());
    return postFetcher<ProductResponse>('/v1/products', params, {
      'Accept-Language': currentLocale,
    });
  },

  getProductBySku: async (
    sku: string,
    locale?: string
  ): Promise<{ success: boolean; data: Product }> => {
    const currentLocale = locale || (await getLocale());
    return fetcher<{ success: boolean; data: Product }>(
      `/v1/products/sku/${sku}`,
      {
        'Accept-Language': currentLocale,
      }
    );
  },
};
