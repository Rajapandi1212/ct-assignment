import {
  Cart as CTCart,
  LineItem as CTLineItem,
  Address as CTAddress,
} from '@commercetools/platform-sdk';
import {
  Cart,
  CartLineItem,
  CartDiscount,
  Discount,
  ShippingInfo,
  Address,
} from '../../../../types/cart';
import { ProductMapper } from '../product/product-mapper';

export class CartMapper {
  /**
   * Maps CommerceTools cart to frontend cart format
   */
  static mapCart(ctCart: CTCart, locale: string): Cart {
    const lineItems = ctCart.lineItems.map((item) =>
      this.mapLineItem(item, locale)
    );

    // Calculate original price (before any discounts)
    const originalPrice = {
      centAmount: ctCart.lineItems.reduce((sum, item) => {
        // Use the original price (before product discounts)
        const pricePerItem = item.price.value.centAmount;
        return sum + pricePerItem * item.quantity;
      }, 0),
      currencyCode: ctCart.totalPrice.currencyCode,
      fractionDigits: ctCart.totalPrice.fractionDigits,
    };

    // Calculate subtotal (after line item discounts, before cart-level discounts)
    // Use net amount if taxedPrice is available, otherwise use totalPrice
    const subtotal = ctCart.taxedPrice
      ? {
          centAmount: ctCart.taxedPrice.totalNet.centAmount,
          currencyCode: ctCart.taxedPrice.totalNet.currencyCode,
          fractionDigits: ctCart.taxedPrice.totalNet.fractionDigits,
        }
      : {
          centAmount: ctCart.lineItems.reduce(
            (sum, item) => sum + item.totalPrice.centAmount,
            0
          ),
          currencyCode: ctCart.totalPrice.currencyCode,
          fractionDigits: ctCart.totalPrice.fractionDigits,
        };

    // Map cart-level discounts
    const cartDiscounts: CartDiscount[] = [];

    if (ctCart.discountOnTotalPrice) {
      ctCart.discountOnTotalPrice.includedDiscounts.forEach((discount) => {
        cartDiscounts.push({
          type: 'cart',
          discountId: discount.discount.id,
          name: (discount.discount as any).obj?.name?.[locale],
          description: (discount.discount as any).obj?.description?.[locale],
          value: {
            centAmount: discount.discountedAmount.centAmount,
            currencyCode: discount.discountedAmount.currencyCode,
            fractionDigits: discount.discountedAmount.fractionDigits,
          },
        });
      });
    }

    // Map discount codes
    const discountCodes = (ctCart.discountCodes || []).map((dc) => ({
      code: (dc.discountCode as any).obj?.code || '',
      discountCodeId: dc.discountCode.id,
      state: dc.state,
    }));

    // Map shipping info
    let shippingInfo: ShippingInfo | undefined;
    if (ctCart.shippingInfo) {
      shippingInfo = {
        shippingMethodName: ctCart.shippingInfo.shippingMethodName,
        price: {
          centAmount: ctCart.shippingInfo.price.centAmount,
          currencyCode: ctCart.shippingInfo.price.currencyCode,
          fractionDigits: ctCart.shippingInfo.price.fractionDigits,
        },
        taxRate: ctCart.shippingInfo.taxRate?.amount,
      };
    }

    // Map tax information from taxedPrice
    let taxInfo;
    if (ctCart.taxedPrice) {
      taxInfo = {
        taxedPrice: {
          totalNet: {
            centAmount: ctCart.taxedPrice.totalNet.centAmount,
            currencyCode: ctCart.taxedPrice.totalNet.currencyCode,
            fractionDigits: ctCart.taxedPrice.totalNet.fractionDigits,
          },
          totalGross: {
            centAmount: ctCart.taxedPrice.totalGross.centAmount,
            currencyCode: ctCart.taxedPrice.totalGross.currencyCode,
            fractionDigits: ctCart.taxedPrice.totalGross.fractionDigits,
          },
          totalTax: {
            centAmount:
              ctCart.taxedPrice.totalGross.centAmount -
              ctCart.taxedPrice.totalNet.centAmount,
            currencyCode: ctCart.taxedPrice.totalGross.currencyCode,
            fractionDigits: ctCart.taxedPrice.totalGross.fractionDigits,
          },
        },
        taxPortions: (ctCart.taxedPrice.taxPortions || []).map((portion) => ({
          name: portion.name,
          rate: portion.rate,
          amount: {
            centAmount: portion.amount.centAmount,
            currencyCode: portion.amount.currencyCode,
            fractionDigits: portion.amount.fractionDigits,
          },
        })),
      };
    }

    // Map addresses
    const shippingAddress = ctCart.shippingAddress
      ? this.mapAddress(ctCart.shippingAddress)
      : undefined;
    const billingAddress = ctCart.billingAddress
      ? this.mapAddress(ctCart.billingAddress)
      : undefined;

    return {
      id: ctCart.id,
      version: ctCart.version,
      createdAt: ctCart.createdAt,
      lastModifiedAt: ctCart.lastModifiedAt,
      anonymousId: ctCart.anonymousId,
      customerId: ctCart.customerId,
      locale: ctCart.locale || locale,
      country: ctCart.country || '',
      currency: ctCart.totalPrice.currencyCode,
      cartState: ctCart.cartState,
      inventoryMode: ctCart.inventoryMode,
      origin: ctCart.origin,
      lineItems,
      totalLineItemQuantity: ctCart.totalLineItemQuantity || 0,
      originalPrice,
      subtotal,
      totalPrice: {
        centAmount: ctCart.totalPrice.centAmount,
        currencyCode: ctCart.totalPrice.currencyCode,
        fractionDigits: ctCart.totalPrice.fractionDigits,
      },
      taxInfo,
      discounts: cartDiscounts,
      shippingInfo,
      shippingAddress,
      billingAddress,
      discountCodes,
    };
  }

  /**
   * Maps CommerceTools address to frontend format
   */
  private static mapAddress(ctAddress: CTAddress): Address {
    return {
      firstName: ctAddress.firstName || '',
      lastName: ctAddress.lastName || '',
      streetName: ctAddress.streetName || '',
      streetNumber: ctAddress.streetNumber,
      city: ctAddress.city || '',
      postalCode: ctAddress.postalCode || '',
      country: ctAddress.country,
      phone: ctAddress.phone || '',
      email: ctAddress.email || '',
    };
  }

  /**
   * Maps CommerceTools line item to frontend format
   */
  private static mapLineItem(
    ctLineItem: CTLineItem,
    locale: string
  ): CartLineItem {
    // Map variant using ProductMapper
    const variant = ProductMapper.ctVariantToVariant(
      ctLineItem.variant,
      locale
    );

    // Collect all discounts for this line item
    const discounts: Discount[] = [];

    // 1. Product discount (applied before adding to cart)
    if (ctLineItem.price.discounted) {
      const productDiscountAmount =
        ctLineItem.price.value.centAmount -
        ctLineItem.price.discounted.value.centAmount;

      discounts.push({
        type: 'product',
        discountId: ctLineItem.price.discounted.discount.id,
        name: (ctLineItem.price.discounted.discount as any).obj?.name?.[locale],
        description: (ctLineItem.price.discounted.discount as any).obj
          ?.description?.[locale],
        value: {
          centAmount: productDiscountAmount * ctLineItem.quantity,
          currencyCode: ctLineItem.price.value.currencyCode,
          fractionDigits: ctLineItem.price.value.fractionDigits,
        },
      });
    }

    // 2. Line item cart discounts
    if (
      ctLineItem.discountedPricePerQuantity &&
      ctLineItem.discountedPricePerQuantity.length > 0
    ) {
      ctLineItem.discountedPricePerQuantity.forEach((dpq) => {
        dpq.discountedPrice.includedDiscounts.forEach((discount) => {
          discounts.push({
            type: 'lineItem',
            discountId: discount.discount.id,
            name: (discount.discount as any).obj?.name?.[locale],
            description: (discount.discount as any).obj?.description?.[locale],
            value: {
              centAmount: discount.discountedAmount.centAmount,
              currencyCode: discount.discountedAmount.currencyCode,
              fractionDigits: discount.discountedAmount.fractionDigits,
            },
          });
        });
      });
    }

    const slug =
      ctLineItem.productSlug?.[locale] ||
      ctLineItem.productSlug?.['en-US'] ||
      '';
    const productKey = ctLineItem.productKey || '';
    const url = `/${slug}/${productKey}`;

    return {
      id: ctLineItem.id,
      productId: ctLineItem.productId,
      productKey: ctLineItem.productKey,
      name: ctLineItem.name[locale] || ctLineItem.name['en-US'] || '',
      slug,
      url,
      variant,
      quantity: ctLineItem.quantity,
      price: variant.price!,
      originalPrice: {
        centAmount: ctLineItem.price.value.centAmount * ctLineItem.quantity,
        currencyCode: ctLineItem.price.value.currencyCode,
        fractionDigits: ctLineItem.price.value.fractionDigits,
      },
      totalPrice: {
        centAmount: ctLineItem.totalPrice.centAmount,
        currencyCode: ctLineItem.totalPrice.currencyCode,
        fractionDigits: ctLineItem.totalPrice.fractionDigits,
      },
      discounts,
    };
  }
}
