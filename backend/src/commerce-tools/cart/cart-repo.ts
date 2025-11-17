import {
  Cart as CTCart,
  CartDraft,
  CartUpdateAction,
} from '@commercetools/platform-sdk';
import { Cart } from '../../../../types/cart';
import { BaseRepository } from '../base-repo';
import { CartMapper } from './cart-mapper';
import logger from '../../utils/logger';
import { getLocaleInfo } from '../../utils/locale-info';

interface CreateCartParams {
  customerId?: string;
  anonymousId?: string;
  locale: string;
}

// Expand parameters for cart queries to include discount details
const CART_EXPAND_PARAMS = [
  'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount',
  'discountOnTotalPrice.includedDiscounts[*].discount',
  'discountCodes[*].discountCode',
];

export class CartRepository extends BaseRepository {
  /**
   * Get or create cart for an authenticated user
   * @param customerId The ID of the customer
   * @param locale The locale string (e.g., 'en-US')
   * @returns The user's cart (existing or newly created)
   */
  public async getForUser(customerId: string, locale: string): Promise<Cart> {
    try {
      const response = await this.requestBuilder()
        .carts()
        .get({
          queryArgs: {
            where: `customerId="${customerId}" AND locale="${locale}"`,
            expand: CART_EXPAND_PARAMS,
          },
        })
        .execute();

      if (response.body.results[0]) {
        return CartMapper.mapCart(response.body.results[0], locale);
      }

      const newCart = await this.createCart({ customerId, locale });
      return CartMapper.mapCart(newCart, locale);
    } catch (error) {
      logger.error('Error getting user cart, creating new one', {
        error,
        customerId,
        locale,
      });
      const newCart = await this.createCart({ customerId, locale });
      return CartMapper.mapCart(newCart, locale);
    }
  }

  /**
   * Get or create an anonymous cart by anonymous ID
   * @param anonymousId The anonymous ID
   * @param locale The locale string (e.g., 'en-US')
   * @returns The anonymous cart (existing or newly created)
   */
  public async getAnonymous(
    anonymousId: string,
    locale: string
  ): Promise<Cart> {
    try {
      const response = await this.requestBuilder()
        .carts()
        .get({
          queryArgs: {
            where: `anonymousId="${anonymousId}" AND locale="${locale}"`,
            expand: CART_EXPAND_PARAMS,
          },
        })
        .execute();

      if (response.body.results[0]) {
        return CartMapper.mapCart(response.body.results[0], locale);
      }

      const newCart = await this.createCart({ anonymousId, locale });
      return CartMapper.mapCart(newCart, locale);
    } catch (error) {
      logger.error('Error getting anonymous cart, creating new one', {
        error,
        anonymousId,
        locale,
      });
      const newCart = await this.createCart({ anonymousId, locale });
      return CartMapper.mapCart(newCart, locale);
    }
  }

  /**
   * Get cart by its ID with expanded references and map to frontend format
   * @param cartId The ID of the cart
   * @param locale The locale for mapping
   * @returns The mapped cart
   * @throws Error if cart not found or other error occurs
   */
  public async getById(cartId: string, locale: string): Promise<Cart> {
    const response = await this.requestBuilder()
      .carts()
      .withId({ ID: cartId })
      .get({
        queryArgs: {
          expand: CART_EXPAND_PARAMS,
        },
      })
      .execute();

    return CartMapper.mapCart(response.body, locale);
  }

  /**
   * Create a new cart
   * @param params Parameters for cart creation
   * @returns The newly created cart
   */
  private async createCart({
    customerId,
    anonymousId,
    locale,
  }: CreateCartParams): Promise<CTCart> {
    try {
      const { country, currency } = getLocaleInfo(locale);
      const cartDraft: CartDraft = {
        currency,
        country,
        locale,
        inventoryMode: 'ReserveOnOrder',
        ...(customerId && { customerId }),
        ...(anonymousId && { anonymousId }),
      };

      const response = await this.requestBuilder()
        .carts()
        .post({
          body: cartDraft,
          queryArgs: {
            expand: CART_EXPAND_PARAMS,
          },
        })
        .execute();

      logger.info('Created new cart', {
        cartId: response.body.id,
        customerId,
        anonymousId,
        locale,
      });

      return response.body;
    } catch (error) {
      logger.error('Failed to create cart', {
        error,
        customerId,
        anonymousId,
        locale,
      });
      throw new Error('Failed to create cart');
    }
  }

  public async updateCart(
    cartId: string,
    version: number,
    actions: CartUpdateAction[],
    locale: string
  ): Promise<Cart> {
    const response = await this.requestBuilder()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version,
          actions,
        },
        queryArgs: {
          expand: CART_EXPAND_PARAMS,
        },
      })
      .execute();

    return CartMapper.mapCart(response.body, locale);
  }

  /**
   * Add a discount code to the cart
   * @param cartId The ID of the cart
   * @param version The current version of the cart
   * @param code The discount code to add
   * @param locale The locale for mapping
   * @returns The updated mapped cart
   */
  public async addDiscountCode(
    cartId: string,
    version: number,
    code: string,
    locale: string
  ): Promise<Cart> {
    return this.updateCart(
      cartId,
      version,
      [
        {
          action: 'addDiscountCode',
          code,
        },
      ],
      locale
    );
  }

  /**
   * Remove a discount code from the cart
   * @param cartId The ID of the cart
   * @param version The current version of the cart
   * @param discountCodeId The ID of the discount code reference to remove
   * @param locale The locale for mapping
   * @returns The updated mapped cart
   */
  public async removeDiscountCode(
    cartId: string,
    version: number,
    discountCodeId: string,
    locale: string
  ): Promise<Cart> {
    return this.updateCart(
      cartId,
      version,
      [
        {
          action: 'removeDiscountCode',
          discountCode: {
            typeId: 'discount-code',
            id: discountCodeId,
          },
        },
      ],
      locale
    );
  }

  /**
   * Update shipping and billing addresses
   * @param cartId The ID of the cart
   * @param version The current version of the cart
   * @param address The address to set for both shipping and billing
   * @param locale The locale for mapping
   * @returns The updated mapped cart
   */
  public async updateAddresses(
    cartId: string,
    version: number,
    address: any,
    locale: string
  ): Promise<Cart> {
    const actions: CartUpdateAction[] = [
      {
        action: 'setShippingAddress',
        address: {
          firstName: address.firstName,
          lastName: address.lastName,
          streetName: address.streetName,
          streetNumber: address.streetNumber,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone,
          email: address.email,
        },
      },
      {
        action: 'setBillingAddress',
        address: {
          firstName: address.firstName,
          lastName: address.lastName,
          streetName: address.streetName,
          streetNumber: address.streetNumber,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
          phone: address.phone,
          email: address.email,
        },
      },
    ];

    return this.updateCart(cartId, version, actions, locale);
  }

  /**
   * Remove a line item from the cart
   * @param cartId The ID of the cart
   * @param version The current version of the cart
   * @param lineItemId The ID of the line item to remove
   * @param locale The locale for mapping
   * @returns The updated mapped cart
   */
  public async removeLineItem(
    cartId: string,
    version: number,
    lineItemId: string,
    locale: string
  ): Promise<Cart> {
    return this.updateCart(
      cartId,
      version,
      [
        {
          action: 'removeLineItem',
          lineItemId,
        },
      ],
      locale
    );
  }

  /**
   * Set shipping method for the cart
   * @param cartId The ID of the cart
   * @param version The current version of the cart
   * @param shippingMethodId The ID of the shipping method to set
   * @param locale The locale for mapping
   * @returns The updated mapped cart
   */
  public async setShippingMethod(
    cartId: string,
    version: number,
    shippingMethodId: string,
    locale: string
  ): Promise<Cart> {
    return this.updateCart(
      cartId,
      version,
      [
        {
          action: 'setShippingMethod',
          shippingMethod: {
            typeId: 'shipping-method',
            id: shippingMethodId,
          },
        },
      ],
      locale
    );
  }
}

export default new CartRepository();
