import { BaseRepository } from '../base-repo';
import { Product, Filter } from '../../../../types/product';
import { ProductMapper } from './product-mapper';
import { getLocaleInfo } from '../../utils/locale-info';
import { FacetBuilder } from '../../utils/facet-builder';
import { getProductTypes } from '../project/project-controller';
import { SearchQueryExpression } from '@commercetools/platform-sdk';

interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  color?: string;
  finish?: string;
  newArrival?: boolean;
}

interface ProductQueryResult {
  total: number;
  results: Product[];
  facets: Filter[];
}

export class ProductRepository extends BaseRepository {
  constructor() {
    super();
  }

  async query(
    locale: string = 'en-US',
    filters?: ProductFilters
  ): Promise<ProductQueryResult> {
    const limit = filters?.limit || 12;
    const offset = filters?.page ? (filters.page - 1) * limit : 0;
    const { country, currency } = getLocaleInfo(locale);

    const colors = filters?.color ? filters?.color?.split(',') : [];
    const finishes = filters?.finish ? filters?.finish?.split(',') : [];
    const isNew = filters?.newArrival;

    const queryFilters: SearchQueryExpression[] = [];
    if (colors?.length) {
      queryFilters.push({
        exact: {
          field: 'variants.attributes.search-color.key',
          fieldType: 'lenum',
          values: colors,
        },
      });
    }
    if (finishes?.length) {
      queryFilters.push({
        exact: {
          field: 'variants.attributes.search-finish.key',
          fieldType: 'lenum',
          values: finishes,
        },
      });
    }

    if (isNew) {
      queryFilters.push({
        exact: {
          field: 'variants.attributes.new-arrival',
          fieldType: 'boolean',
          value: true,
        },
      });
    }

    // Build sort array based on filter
    const sort: any[] = [];

    switch (filters?.sort) {
      case 'a-z':
        sort.push({
          field: 'name',
          order: 'asc',
          language: locale,
        });
        break;
      case 'z-a':
        sort.push({
          field: 'name',
          order: 'desc',
          language: locale,
        });
        break;
      case 'price-low':
        sort.push({
          field: 'variants.prices.centAmount',
          order: 'asc',
          filter: {
            and: [
              {
                exact: {
                  field: 'variants.prices.country',
                  value: country,
                },
              },
              {
                exact: {
                  field: 'variants.prices.currencyCode',
                  value: currency,
                },
              },
            ],
          },
        });
        break;
      case 'price-high':
        sort.push({
          field: 'variants.prices.centAmount',
          order: 'desc',
          filter: {
            and: [
              {
                exact: {
                  field: 'variants.prices.country',
                  value: country,
                },
              },
              {
                exact: {
                  field: 'variants.prices.currencyCode',
                  value: currency,
                },
              },
            ],
          },
        });
        break;
      case 'new-arrival':
        sort.push({
          field: 'variants.attributes.new-arrival',
          fieldType: 'boolean',
          order: 'desc',
        });
        break;
      case 'relevant':
      default:
        // Default relevance sorting (no explicit sort)
        break;
    }

    const res = await this.requestBuilder()
      .products()
      .search()
      .post({
        body: {
          limit,
          offset,
          ...(queryFilters.length > 0
            ? { query: { filter: queryFilters } }
            : {}),
          productProjectionParameters: {
            localeProjection: [locale],
          },
          ...(sort.length > 0 && { sort }),
          facets: [
            {
              distinct: {
                name: 'variants.attributes.search-color',
                field: 'variants.attributes.search-color.key',
                fieldType: 'lenum',
                language: locale,
              },
            },
            {
              distinct: {
                name: 'variants.attributes.search-finish',
                field: 'variants.attributes.search-finish.key',
                fieldType: 'lenum',
                language: locale,
              },
            },
            {
              distinct: {
                name: 'variants.attributes.new-arrival',
                field: 'variants.attributes.new-arrival',
                fieldType: 'boolean',
              },
            },
          ],
        },
      })
      .execute();

    const mappedProducts = res.body.results.map((ctProduct) =>
      ProductMapper.ctProductToProduct(ctProduct, locale)
    );

    const productTypes = await getProductTypes();
    const productType = productTypes.results?.find(
      (pt) => pt.key === 'furniture-and-decor'
    );

    const facets = FacetBuilder.buildFacets(
      productType,
      res.body.facets || [],
      locale
    );

    return {
      total: res.body.total || 0,
      results: mappedProducts,
      facets,
    };
  }

  async getBySku(sku: string, locale: string = 'en-US'): Promise<Product> {
    const res = await this.requestBuilder()
      .productProjections()
      .withKey({ key: sku })
      .get({
        queryArgs: {
          localeProjection: [locale],
          staged: false,
          withTotal: false,
        },
      })
      .execute();
    const product = ProductMapper.ctProductProjectionToProduct(
      res.body,
      locale
    );
    return product;
  }
}
