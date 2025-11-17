'use client';

import { useCart } from '@/services/cart.service';
import { useRouter } from 'next/navigation';
import CartSummary from '@/components/checkout/CartSummary';
import AddressForm from '@/components/checkout/AddressForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import ShippingMethodSelector from '@/components/checkout/ShippingMethodSelector';
import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState<any>(null);

  // Update address when cart loads
  useEffect(() => {
    if (cart?.shippingAddress) {
      setShippingAddress(cart.shippingAddress);
    }
  }, [cart]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || cart.lineItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <svg
            className="mx-auto h-24 w-24 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="mt-6 text-2xl font-display font-semibold text-neutral-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-neutral-600">
            Add some products to your cart to continue shopping
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">
        Checkout
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-7">
          <CartSummary cart={cart} />

          {/* Address Form */}
          <div className="mt-8">
            <AddressForm
              title="Shipping & Billing Address"
              address={shippingAddress}
              onAddressChange={setShippingAddress}
              cartCountry={cart.country}
            />
          </div>

          {/* Shipping Method Selector */}
          {cart.shippingAddress && (
            <div className="mt-8">
              <ShippingMethodSelector cart={cart} />
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <OrderSummary
            cart={cart}
            hasValidAddresses={!!cart.shippingAddress && !!cart.billingAddress}
          />
        </div>
      </div>
    </div>
  );
}
