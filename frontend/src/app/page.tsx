import FilterSection from '@/components/plp/FilterSection';
import SortSection from '@/components/plp/SortSection';
import ProductTile from '@/components/plp/ProductTile';
import Pagination from '@/components/plp/Pagination';
import { Filter, Product } from '@shared/product';
import { productService, ProductQueryParams } from '@/services/product.service';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    color?: string;
    finish?: string;
    'new-arrival'?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const queryParams: ProductQueryParams = {
    page: Number(params.page) || 1,
    limit: 12,
  };

  if (params.sort) queryParams.sort = params.sort;
  if (params.color) queryParams.color = params.color;
  if (params.finish) queryParams.finish = params.finish;
  if (params['new-arrival'] === 'true') queryParams.newArrival = true;

  let products: Product[] = [];
  let total = 0;
  let facets: Filter[] = [];
  let error = null;

  try {
    const response = await productService.getProducts(queryParams);
    products = response.data.products;
    total = response.data.total;
    facets = response.data.facets;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load products';
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSection filters={facets} />

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-semibold text-neutral-900">
              Products ({total})
            </h1>
            <SortSection />
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600">
                No products found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductTile
                    key={product.productId}
                    product={product}
                    priority={index < 4}
                  />
                ))}
              </div>

              <Pagination
                currentPage={queryParams.page || 1}
                totalItems={total}
                itemsPerPage={queryParams.limit || 12}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
