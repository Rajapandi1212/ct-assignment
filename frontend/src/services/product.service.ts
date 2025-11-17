import { Product, Filter } from '@shared/product';
import { ApiResponse } from '@shared/index';
import { fetcher, postFetcher } from '@/lib/fetcher';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  color?: string;
  finish?: string;
  newArrival?: boolean;
}

export interface ProductListData {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  facets: Filter[];
}

export const productService = {
  getProducts: async (
    params: ProductQueryParams,
    locale: string
  ): Promise<ApiResponse<ProductListData>> => {
    return postFetcher<ApiResponse<ProductListData>>('/v1/products', params, {
      'Accept-Language': locale,
    });
  },

  getProductBySku: async (
    sku: string,
    locale: string
  ): Promise<ApiResponse<Product>> => {
    return fetcher<ApiResponse<Product>>(`/v1/products/sku/${sku}`, {
      'Accept-Language': locale,
    });
  },
};
