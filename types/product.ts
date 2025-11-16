export interface ProductAttribute {
  [key: string]: {
    value: string | boolean;
    label: string;
  };
}

export interface Price {
  value: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
  country?: string;
  discounted?: {
    value: {
      centAmount: number;
      currencyCode: string;
      fractionDigits: number;
    };
  };
}

export interface Image {
  url: string;
  dimensions: {
    w: number;
    h: number;
  };
  label?: string;
}

export interface ProductVariant {
  sku?: string;
  key?: string;
  attributes: ProductAttribute[];
  price?: Price;
  images: Image[];
}

export interface Product {
  name?: string;
  key?: string;
  productId: string;
  slug?: string;
  description?: string;
  variants: ProductVariant[];
  url: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  facets: Filter[];
}

// Frontend-specific filter types
export interface FilterValue {
  key: string;
  label: string;
  isSelected: boolean;
  count: number;
}

export interface CheckboxFilter {
  key: string;
  label: string;
  type: 'checkbox';
  values: FilterValue[];
}

export interface BooleanFilter {
  key: string;
  label: string;
  type: 'boolean';
  isSelected: boolean;
}

export type Filter = CheckboxFilter | BooleanFilter;

export type SortOption =
  | 'relevant'
  | 'a-z'
  | 'z-a'
  | 'price-low'
  | 'price-high'
  | 'new-arrival';
