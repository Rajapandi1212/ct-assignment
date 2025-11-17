'use client';

import { Cart } from '@shared/cart';
import { useState } from 'react';
import { formatPrice } from '@/utils/format-price';
import { applyDiscountCode, removeDiscountCode } from '@/services/cart.service';
import { useLocale } from '@/contexts/LocaleContext';
import { useCartLoading } from '@/contexts/CartLoadingContext';

interface OrderSummaryProps {
  cart: Cart;
  hasValidAddresses: boolean;
}

export default function OrderSummary({
  cart,
  hasValidAddresses,
}: OrderSummaryProps) {
  const { locale } = useLocale();
  const { setCartLoading } = useCartLoading();
  const [isOpen, setIsOpen] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate totals
  const originalPrice = cart.originalPrice;
  const subtotal = cart.subtotal;

  // Calculate savings from line items (product + line item discounts)
  const lineItemSavings = originalPrice.centAmount - cart.subtotal.centAmount;

  // Calculate cart-level discount savings
  const cartDiscountSavings = cart.discounts.reduce(
    (sum, discount) => sum + discount.value.centAmount,
    0
  );

  // Total savings = line item savings + cart discounts (cumulative)
  const totalSavings = lineItemSavings + cartDiscountSavings;

  const taxAmount = cart.taxInfo?.taxedPrice?.totalTax.centAmount || 0;
  const taxPortions = cart.taxInfo?.taxPortions || [];

  const effectiveTaxRate = (taxPortions?.[0]?.rate || 0) * 100;

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    setIsApplying(true);
    setCartLoading(true);
    setError('');
    setSuccess('');

    const response = await applyDiscountCode(discountCode.trim(), locale);

    setCartLoading(false);
    if (response.success) {
      setSuccess('Discount code applied successfully!');
      setDiscountCode('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(response.error?.message || 'Failed to apply discount code');
    }

    setIsApplying(false);
  };

  const handleRemoveDiscount = async (discountCodeId: string) => {
    setIsRemoving(discountCodeId);
    setCartLoading(true);
    setError('');
    setSuccess('');

    const response = await removeDiscountCode(discountCodeId, locale);

    setCartLoading(false);
    if (response.success) {
      setSuccess('Discount code removed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(response.error?.message || 'Failed to remove discount code');
    }

    setIsRemoving(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 sticky top-24">
      {/* Mobile/Tablet Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <h2 className="text-lg font-display font-semibold text-neutral-900">
          Order Summary
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
          Order Summary
        </h2>
      </div>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[2000px]' : 'max-h-0'
        } lg:max-h-none`}
      >
        <div className="p-6">
          {/* Discount Code Form */}
          <form onSubmit={handleApplyDiscount} className="mb-6">
            <label
              htmlFor="discountCode"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Discount Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="discountCode"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isApplying}
              />
              <button
                type="submit"
                disabled={isApplying || !discountCode.trim()}
                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isApplying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Applying...</span>
                  </>
                ) : (
                  'Apply'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}
          </form>

          {/* Applied Discount Codes */}
          {cart.discountCodes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-700 mb-2">
                Applied Codes
              </h3>
              <div className="space-y-2">
                {cart.discountCodes.map((discount) => (
                  <div
                    key={discount.discountCodeId}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-green-900">
                        {discount.code}
                      </span>
                      <span className="text-xs text-green-600">
                        ({discount.state})
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveDiscount(discount.discountCodeId)
                      }
                      disabled={isRemoving === discount.discountCodeId}
                      className="text-red-600 hover:text-red-700 disabled:text-neutral-400 transition-colors"
                    >
                      {isRemoving === discount.discountCodeId ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-3 border-t border-neutral-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="text-neutral-900 font-medium">
                {formatPrice(originalPrice)}
              </span>
            </div>

            {cart.shippingInfo && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className="text-neutral-900 font-medium">
                  {formatPrice(cart.shippingInfo.price)}
                </span>
              </div>
            )}

            {/* Your Savings - show cumulative savings */}
            {totalSavings > 0 && (
              <div className="flex justify-between text-sm bg-green-50 -mx-6 px-6 py-2 border-y border-green-100">
                <span className="text-green-700 font-semibold">
                  Your Savings
                </span>
                <span className="text-green-700 font-bold">
                  -
                  {formatPrice({
                    centAmount: totalSavings,
                    currencyCode: cart.currency,
                    fractionDigits: subtotal.fractionDigits,
                  })}
                </span>
              </div>
            )}

            <div className="flex justify-between text-lg font-display font-semibold border-t border-neutral-200 pt-3">
              <span className="text-neutral-900">Total</span>
              <span className="text-primary-600">
                {cart.taxInfo?.taxedPrice?.totalGross
                  ? formatPrice(cart.taxInfo.taxedPrice.totalGross)
                  : formatPrice(cart.totalPrice)}
              </span>
            </div>

            {/* Tax Inclusive Notice */}
            {taxAmount > 0 && (
              <div className="bg-neutral-50 -mx-6 px-6 py-3 border-t border-neutral-200">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs text-neutral-600 font-medium">
                      Tax Included
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      All prices include{' '}
                      {formatPrice({
                        centAmount: taxAmount,
                        currencyCode: cart.currency,
                        fractionDigits: subtotal.fractionDigits,
                      })}{' '}
                      in taxes
                      {effectiveTaxRate > 0 &&
                        ` (${effectiveTaxRate.toFixed(1)}%)`}
                    </p>
                    {taxPortions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {taxPortions.map((portion, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between text-xs text-neutral-500"
                          >
                            <span>
                              • {portion.name || 'Tax'} (
                              {(portion.rate * 100).toFixed(1)}%)
                            </span>
                            <span>{formatPrice(portion.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Place Order Button */}
          <button
            disabled={!hasValidAddresses}
            className="w-full mt-6 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <span>Place Order</span>
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>

          {!hasValidAddresses && (
            <p className="mt-2 text-xs text-center text-amber-600">
              Please save your shipping address to continue
            </p>
          )}

          <p className="mt-4 text-xs text-center text-neutral-500">
            By placing your order, you agree to our terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}
