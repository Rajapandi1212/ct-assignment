import { Cart, CartDraft, CartUpdateAction } from '@commercetools/platform-sdk';
import { BaseRepository } from '../base-repo';
import logger from '../../utils/logger';
import { getLocaleInfo } from '../../utils/locale-info';

interface CreateCartParams {
  customerId?: string;
  anonymousId?: string;
  locale: string;
}

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
          },
        })
        .execute();

      return (
        response.body.results[0] || this.createCart({ customerId, locale })
      );
    } catch (error) {
      logger.error('Error getting user cart, creating new one', {
        error,
        customerId,
        locale,
      });
      return this.createCart({ customerId, locale });
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
          },
        })
        .execute();

      return (
        response.body.results[0] || this.createCart({ anonymousId, locale })
      );
    } catch (error) {
      logger.error('Error getting anonymous cart, creating new one', {
        error,
        anonymousId,
        locale,
      });
      return this.createCart({ anonymousId, locale });
    }
  }

  /**
   * Get cart by its ID
   * @param cartId The ID of the cart
   * @returns The cart
   * @throws Error if cart not found or other error occurs
   */
  public async getById(cartId: string): Promise<Cart> {
    const response = await this.requestBuilder()
      .carts()
      .withId({ ID: cartId })
      .get()
      .execute();

    return response.body;
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
  }: CreateCartParams): Promise<Cart> {
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
    actions: CartUpdateAction[]
  ): Promise<Cart> {
    const response = await this.requestBuilder()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version,
          actions,
        },
      })
      .execute();

    return response.body;
  }
}

export default new CartRepository();
