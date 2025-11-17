import { ProductVariant, Price } from "./product";

// Discount types
export interface ProductDiscount {
  type: "product";
  discountId: string;
  name?: string;
  description?: string;
  value: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
}

export interface LineItemDiscount {
  type: "lineItem";
  discountId: string;
  name?: string;
  description?: string;
  value: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
}

export interface CartDiscount {
  type: "cart";
  discountId: string;
  name?: string;
  description?: string;
  code?: string; // If applied via discount code
  value: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
}

export type Discount = ProductDiscount | LineItemDiscount | CartDiscount;

// Line item
export interface CartLineItem {
  id: string;
  productId: string;
  productKey?: string;
  name: string;
  slug: string;
  url: string;
  variant: ProductVariant;
  quantity: number;
  price: Price;
  originalPrice: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
  totalPrice: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
  discounts: Discount[];
}

// Address
export interface Address {
  firstName: string;
  lastName: string;
  streetName: string;
  streetNumber?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

// Shipping
export interface ShippingInfo {
  shippingMethodId?: string;
  shippingMethodName?: string;
  price: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
  taxRate?: number;
}

export interface ShippingMethod {
  id: string;
  key?: string;
  name: string;
  description?: string;
  price: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
  isDefault: boolean;
}

// Tax information
export interface TaxInfo {
  taxedPrice?: {
    totalNet: {
      centAmount: number;
      currencyCode: string;
      fractionDigits: number;
    };
    totalGross: {
      centAmount: number;
      currencyCode: string;
      fractionDigits: number;
    };
    totalTax: {
      centAmount: number;
      currencyCode: string;
      fractionDigits: number;
    };
  };
  taxPortions: Array<{
    name?: string;
    rate: number;
    amount: {
      centAmount: number;
      currencyCode: string;
      fractionDigits: number;
    };
  }>;
}

// Cart summary
export interface Cart {
  id: string;
  version: number;
  createdAt: string;
  lastModifiedAt: string;
  anonymousId?: string;
  customerId?: string;
  locale: string;
  country: string;
  currency: string;
  cartState: string;
  inventoryMode: string;
  origin: string;
  lineItems: CartLineItem[];
  totalLineItemQuantity: number;
  originalPrice: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
  subtotal: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
  totalPrice: {
    centAmount: number;
    currencyCode: string;
    fractionDigits: number;
  };
  taxInfo?: TaxInfo;
  discounts: CartDiscount[]; // Cart-level discounts only
  shippingInfo?: ShippingInfo;
  shippingAddress?: Address;
  billingAddress?: Address;
  discountCodes: Array<{
    code: string;
    discountCodeId: string;
    state: string;
  }>;
}
