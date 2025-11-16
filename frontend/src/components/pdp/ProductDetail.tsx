'use client';

import { Product, ProductVariant } from '@shared/product';
import { useState, useMemo } from 'react';
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [currentVariant, setCurrentVariant] = useState<ProductVariant>(
    product.variants[0]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ProductImages variant={currentVariant} productName={product.name} />
      <ProductInfo
        product={product}
        currentVariant={currentVariant}
        onVariantChange={setCurrentVariant}
      />
    </div>
  );
}
