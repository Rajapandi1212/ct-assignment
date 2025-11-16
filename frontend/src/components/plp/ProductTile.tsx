import { Product } from '@shared/product';
import Image from 'next/image';
import Link from 'next/link';

interface ProductTileProps {
  product: Product;
  priority?: boolean; // For above-the-fold images
}

export default function ProductTile({
  product,
  priority = false,
}: ProductTileProps) {
  const masterVariant = product.variants[0];
  const image = masterVariant?.images[0];
  const price = masterVariant?.price;

  // Check if product is new arrival from variant attributes
  const isNewArrival =
    masterVariant?.attributes?.['new-arrival']?.value === true;

  const displayPrice = price
    ? (
        price.value.centAmount / Math.pow(10, price.value.fractionDigits)
      ).toFixed(price.value.fractionDigits)
    : '0.00';

  const discountedPrice = price?.discounted
    ? (
        price.discounted.value.centAmount /
        Math.pow(10, price.discounted.value.fractionDigits)
      ).toFixed(price.discounted.value.fractionDigits)
    : null;

  const discountPercentage =
    price && discountedPrice
      ? Math.round(
          ((parseFloat(displayPrice) - parseFloat(discountedPrice)) /
            parseFloat(displayPrice)) *
            100
        )
      : null;

  return (
    <Link href={product.url} className="group cursor-pointer block">
      <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-3">
        {image ? (
          <Image
            src={image.url}
            alt={product.name || 'Product'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-fit group-hover:scale-105 transition-transform duration-300 p-2"
            quality={80}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
        {discountPercentage && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
        {isNewArrival && (
          <div className="absolute top-3 right-3 bg-secondary-600 text-white text-xs font-semibold px-2 py-1 rounded">
            NEW
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
          {product.name || 'Unnamed Product'}
        </h3>
        <p className="text-sm text-neutral-500">
          {masterVariant?.sku || 'N/A'}
        </p>
        <div className="flex items-center space-x-2">
          {discountedPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {price?.value.currencyCode} {displayPrice}
            </span>
          )}
          <span className="text-lg font-semibold text-neutral-900">
            {price?.value.currencyCode} {discountedPrice || displayPrice}
          </span>
        </div>
      </div>
    </Link>
  );
}
