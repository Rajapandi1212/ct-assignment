import { Product, Filter } from '@shared/product';
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

export const productService = {
  getProducts: async (
    params: ProductQueryParams,
    locale: string
  ): Promise<ProductResponse> => {
    return postFetcher<ProductResponse>('/v1/products', params, {
      'Accept-Language': locale,
    });
  },

  getProductBySku: async (
    sku: string,
    locale: string
  ): Promise<{ success: boolean; data: Product }> => {
    return fetcher<{ success: boolean; data: Product }>(
      `/v1/products/sku/${sku}`,
      undefined,
      { 'Accept-Language': locale }
    );
  },
};
