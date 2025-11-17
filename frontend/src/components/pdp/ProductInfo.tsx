'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { addToCart } from '@/services/cart.service';
import { Product, ProductVariant } from '@shared/product';
import { useState, useMemo, useEffect } from 'react';

interface ProductInfoProps {
  product: Product;
  currentVariant: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
}

export default function ProductInfo({
  product,
  currentVariant,
  onVariantChange,
}: ProductInfoProps) {
  const { locale } = useLocale();
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product?.variants?.[0]?.attributes?.['search-color']?.value as string
  );
  const [selectedFinish, setSelectedFinish] = useState<string | null>(
    product?.variants?.[0]?.attributes?.['search-finish']?.value as string
  );
  const [quantity, setQuantity] = useState(1);

  // Get all unique colors and finishes from variants
  const { colors, finishes } = useMemo(() => {
    const colorSet = new Map<string, string>();
    const finishSet = new Map<string, string>();

    product.variants.forEach((variant) => {
      if (variant.attributes['search-color']) {
        colorSet.set(
          variant.attributes['search-color'].value as string,
          variant.attributes['search-color'].label
        );
      }
      if (variant.attributes['search-finish']) {
        finishSet.set(
          variant.attributes['search-finish'].value as string,
          variant.attributes['search-finish'].label
        );
      }
    });

    return {
      colors: Array.from(colorSet.entries()).map(([key, label]) => ({
        key,
        label,
      })),
      finishes: Array.from(finishSet.entries()).map(([key, label]) => ({
        key,
        label,
      })),
    };
  }, [product.variants]);

  // Find variant based on selections and notify parent
  useEffect(() => {
    if (!selectedColor && !selectedFinish) {
      onVariantChange(product.variants[0]);
      return;
    }

    const foundVariant = product.variants.find((variant) => {
      const variantColor = variant.attributes['search-color']?.value;
      const variantFinish = variant.attributes['search-finish']?.value;

      const colorMatch = !selectedColor || variantColor === selectedColor;
      const finishMatch = !selectedFinish || variantFinish === selectedFinish;

      return colorMatch && finishMatch;
    });

    onVariantChange(foundVariant || product.variants[0]);
  }, [selectedColor, selectedFinish, product.variants, onVariantChange]);

  // Check which options are available based on current selection
  const availableColors = useMemo(() => {
    return colors.map((color) => {
      const available = product.variants.some((variant) => {
        const variantColor = variant.attributes['search-color']?.value;
        const variantFinish = variant.attributes['search-finish']?.value;

        const colorMatch = variantColor === color.key;
        const finishMatch = !selectedFinish || variantFinish === selectedFinish;

        return colorMatch && finishMatch;
      });

      return { ...color, available };
    });
  }, [colors, selectedFinish, product.variants]);

  const availableFinishes = useMemo(() => {
    return finishes.map((finish) => {
      const available = product.variants.some((variant) => {
        const variantColor = variant.attributes['search-color']?.value;
        const variantFinish = variant.attributes['search-finish']?.value;

        const finishMatch = variantFinish === finish.key;
        const colorMatch = !selectedColor || variantColor === selectedColor;

        return finishMatch && colorMatch;
      });

      return { ...finish, available };
    });
  }, [finishes, selectedColor, product.variants]);

  const price = currentVariant?.price;

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

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleQuantityBlur = () => {
    if (quantity < 1 || isNaN(quantity)) {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (currentVariant.sku) {
      addToCart(currentVariant.sku, quantity, locale);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold text-neutral-900 mb-2">
          {product.name}
        </h1>
        <p className="text-sm text-neutral-500">SKU: {currentVariant?.sku}</p>
      </div>

      <div className="flex items-center space-x-3">
        {discountedPrice && (
          <>
            <span className="text-2xl font-semibold text-neutral-900">
              {price?.value.currencyCode} {discountedPrice}
            </span>
            <span className="text-lg text-neutral-400 line-through">
              {price?.value.currencyCode} {displayPrice}
            </span>
            <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </span>
          </>
        )}
        {!discountedPrice && (
          <span className="text-2xl font-semibold text-neutral-900">
            {price?.value.currencyCode} {displayPrice}
          </span>
        )}
      </div>

      {colors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color.key}
                onClick={() => color.available && setSelectedColor(color.key)}
                disabled={!color.available}
                className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                  selectedColor === color.key
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : color.available
                      ? 'border-neutral-300 hover:border-neutral-400 text-neutral-700'
                      : 'border-neutral-200 text-neutral-400 line-through cursor-not-allowed opacity-50'
                }`}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {finishes.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            Finish
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableFinishes.map((finish) => (
              <button
                key={finish.key}
                onClick={() =>
                  finish.available && setSelectedFinish(finish.key)
                }
                disabled={!finish.available}
                className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFinish === finish.key
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : finish.available
                      ? 'border-neutral-300 hover:border-neutral-400 text-neutral-700'
                      : 'border-neutral-200 text-neutral-400 line-through cursor-not-allowed opacity-50'
                }`}
              >
                {finish.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center border-2 border-neutral-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="w-10 h-12 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            aria-label="Decrease quantity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            min="1"
            value={quantity}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              if (value === '') {
                setQuantity('' as any);
              } else {
                const num = parseInt(value, 10);
                setQuantity(num);
              }
            }}
            onBlur={handleQuantityBlur}
            className="w-16 h-12 text-center border-x-2 border-neutral-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-10 h-12 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            aria-label="Increase quantity"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <button
          className="flex-1 bg-primary-600 text-white h-12 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>

      {product.description && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">
            Description
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
}
