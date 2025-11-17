'use client';

import { Cart } from '@shared/cart';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatPrice } from '@/utils/format-price';
import { removeLineItem } from '@/services/cart.service';
import { useLocale } from '@/contexts/LocaleContext';
import { useCartLoading } from '@/contexts/CartLoadingContext';

interface CartSummaryProps {
  cart: Cart;
}

export default function CartSummary({ cart }: CartSummaryProps) {
  const { locale } = useLocale();
  const { setCartLoading } = useCartLoading();
  const [isOpen, setIsOpen] = useState(true);

  const handleRemoveItem = async (lineItemId: string) => {
    setCartLoading(true);
    const response = await removeLineItem(lineItemId, locale);
    setCartLoading(false);

    if (!response.success) {
      alert(response.error?.message || 'Failed to remove item');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      {/* Mobile/Tablet Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <h2 className="text-lg font-display font-semibold text-neutral-900">
          Cart Items ({cart.totalLineItemQuantity})
        </h2>
        <svg
          className={`w-5 h-5 text-neutral-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Desktop Header */}
      <div className="hidden lg:block px-6 py-4 border-b border-neutral-200">
        <h2 className="text-lg font-display font-semibold text-neutral-900">
          Cart Items ({cart.totalLineItemQuantity})
        </h2>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[2000px]' : 'max-h-0'
        } lg:max-h-none`}
      >
        <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
          {cart.lineItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 pb-4 border-b border-neutral-100 last:border-0"
            >
              <Link
                href={item.url}
                prefetch={false}
                className="relative w-20 h-20 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
              >
                {item.variant.images?.[0] ? (
                  <Image
                    src={item.variant.images[0].url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={item.url}
                  prefetch={false}
                  className="text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors block truncate"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-neutral-600 mt-1">
                  SKU: {item.variant.sku}
                </p>
                {item.variant.attributes?.color && (
                  <p className="text-sm text-neutral-600">
                    Color:{' '}
                    {typeof item.variant.attributes.color === 'object'
                      ? item.variant.attributes.color.label
                      : item.variant.attributes.color}
                  </p>
                )}
                <p className="text-sm text-neutral-600 mt-1">
                  Qty: {item.quantity}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-700 transition-colors p-1"
                  aria-label="Remove item"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                <div className="text-right">
                  {item.discounts.length > 0 && (
                    <p className="text-xs text-neutral-500 line-through mb-1">
                      {formatPrice(item.originalPrice)}
                    </p>
                  )}
                  <p className="text-sm font-medium text-neutral-900">
                    {formatPrice(item.totalPrice)}
                  </p>
                  {item.discounts.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {item.discounts.map((discount, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-green-600 flex items-center justify-end gap-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>
                            {discount.name || `${discount.type} discount`}
                          </span>
                          <span className="font-medium">
                            -{formatPrice(discount.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
