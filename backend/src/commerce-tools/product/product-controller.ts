import { ProductRepository } from './product-repo';
import { ProductListResponse } from '../../../../types/product';

const productRepo = new ProductRepository();

interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  size?: string;
  color?: string;
  finish?: string;
  newArrival?: boolean;
}

export const getProducts = async (
  locale: string,
  filters?: ProductFilters
): Promise<ProductListResponse> => {
  const productRes = await productRepo.query(locale, filters);

  return {
    total: productRes?.total || 0,
    products: productRes?.results || [],
    page: filters?.page || 1,
    limit: filters?.limit || 12,
    facets: productRes?.facets || [],
  };
};
