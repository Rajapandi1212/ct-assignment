'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const totalPrice = searchParams.get('totalPrice');

  if (!orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-display font-semibold text-neutral-900 mb-4">
            No Order Found
          </h2>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg border border-neutral-200 p-8 md:p-12">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-green-600"
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
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-neutral-600">
              Thank you for your order. We&apos;ve received your order and will
              process it shortly.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-6 mb-8">
            <div className="text-center">
              <div className="text-sm text-neutral-600 mb-2">
                Your Order Number
              </div>
              <div className="text-2xl md:text-3xl font-bold text-primary-600 font-mono mb-4">
                {orderNumber}
              </div>
              <p className="text-sm text-neutral-600">
                Please save this order number for your records
              </p>
            </div>

            {totalPrice && (
              <div className="mt-6 pt-6 border-t border-primary-100">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 font-medium">
                    Total Amount Paid
                  </span>
                  <span className="text-2xl font-bold text-neutral-900">
                    {totalPrice}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* What's Next */}
          <div className="mb-8">
            <h2 className="text-xl font-display font-semibold text-neutral-900 mb-4">
              What&apos;s Next?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-neutral-900">
                    Order Confirmation Email
                  </p>
                  <p className="text-sm text-neutral-600">
                    You&apos;ll receive an email confirmation shortly with your
                    order details
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <div>
                  <p className="font-medium text-neutral-900">
                    Order Processing
                  </p>
                  <p className="text-sm text-neutral-600">
                    We&apos;ll start processing your order and prepare it for
                    shipment
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <div>
                  <p className="font-medium text-neutral-900">
                    Shipping Updates
                  </p>
                  <p className="text-sm text-neutral-600">
                    You&apos;ll receive tracking information once your order
                    ships
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 font-medium rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
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
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Order
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-600">
            Need help with your order?{' '}
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
