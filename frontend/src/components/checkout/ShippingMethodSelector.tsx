'use client';

import { useState } from 'react';
import { Cart, ShippingMethod } from '@shared/cart';
import { formatPrice } from '@/utils/format-price';
import { setShippingMethod, useShippingMethods } from '@/services/cart.service';
import { useLocale } from '@/contexts/LocaleContext';
import { useCartLoading } from '@/contexts/CartLoadingContext';

interface ShippingMethodSelectorProps {
  cart: Cart;
}

export default function ShippingMethodSelector({
  cart,
}: ShippingMethodSelectorProps) {
  const { locale } = useLocale();
  const { setCartLoading } = useCartLoading();
  const { shippingMethods, isLoading } = useShippingMethods();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const selectedMethodId = cart.shippingInfo?.shippingMethodId;

  const handleSelectShippingMethod = async (methodId: string) => {
    if (methodId === selectedMethodId) return;

    setIsUpdating(true);
    setCartLoading(true);
    setError('');

    const response = await setShippingMethod(methodId, locale);

    setCartLoading(false);
    setIsUpdating(false);

    if (!response.success) {
      setError(response.error?.message || 'Failed to set shipping method');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">
          Shipping Method
        </h2>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-neutral-200 rounded-lg"></div>
          <div className="h-16 bg-neutral-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!shippingMethods || shippingMethods.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">
          Shipping Method
        </h2>
        <p className="text-sm text-neutral-600">
          Please add a shipping address to see available shipping methods.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
      <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">
        Shipping Method
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {shippingMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedMethodId === method.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-200 hover:border-neutral-300'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name="shippingMethod"
              value={method.id}
              checked={selectedMethodId === method.id}
              onChange={() => handleSelectShippingMethod(method.id)}
              disabled={isUpdating}
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">
                  {method.name}
                </span>
                <span className="text-sm font-semibold text-neutral-900">
                  {method.price.centAmount === 0
                    ? 'Free'
                    : formatPrice(method.price)}
                </span>
              </div>
              {method.description && (
                <p className="mt-1 text-xs text-neutral-600">
                  {method.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>

      {isUpdating && (
        <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          <span>Updating shipping method...</span>
        </div>
      )}
    </div>
  );
}
