'use client';

import { ProductVariant } from '@shared/product';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ProductImagesProps {
  variant: ProductVariant;
  productName?: string;
}

export default function ProductImages({
  variant,
  productName,
}: ProductImagesProps) {
  const images = variant?.images || [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selected index when variant changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [variant.sku]);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-neutral-100 rounded-lg flex items-center justify-center">
        <span className="text-neutral-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden">
        <Image
          src={images[selectedIndex].url}
          alt={productName || 'Product'}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain transition-opacity duration-200"
          quality={85}
          unoptimized={false}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square bg-neutral-100 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedIndex === index
                  ? 'border-primary-600'
                  : 'border-transparent hover:border-neutral-300'
              }`}
            >
              <Image
                src={image.url}
                alt={`${productName} - ${index + 1}`}
                fill
                sizes="25vw"
                className="object-contain"
                quality={60}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
