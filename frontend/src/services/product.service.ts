import { Product, Filter } from '@shared/product';
import { cookies } from 'next/headers';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

    const response = await fetch(`${API_URL}/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': currentLocale,
      },
      body: JSON.stringify(params),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  },

  getProductById: async (
    id: string,
    locale?: string
  ): Promise<{ success: boolean; data: Product }> => {
    const currentLocale = locale || (await getLocale());

    const response = await fetch(`${API_URL}/v1/products/${id}`, {
      headers: {
        'Accept-Language': currentLocale,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  },
};
