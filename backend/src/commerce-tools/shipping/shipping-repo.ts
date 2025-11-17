import { ShippingMethod as CTShippingMethod } from '@commercetools/platform-sdk';
import { ShippingMethod } from '../../../../types/cart';
import { BaseRepository } from '../base-repo';
import logger from '../../utils/logger';

export class ShippingRepository extends BaseRepository {
  /**
   * Get eligible shipping methods for a cart
   * @param cartId The ID of the cart
   * @param locale The locale for localized names
   * @returns Array of eligible shipping methods
   */
  public async getShippingMethodsForCart(
    cartId: string,
    locale: string
  ): Promise<ShippingMethod[]> {
    try {
      const response = await this.requestBuilder()
        .shippingMethods()
        .matchingCart()
        .get({
          queryArgs: {
            cartId,
          },
        })
        .execute();

      return response.body.results.map((method) =>
        this.mapShippingMethod(method, locale)
      );
    } catch (error) {
      logger.error('Error fetching shipping methods for cart', {
        error,
        cartId,
      });
      throw new Error('Failed to fetch shipping methods');
    }
  }

  /**
   * Map CommerceTools shipping method to frontend format
   */
  private mapShippingMethod(
    ctMethod: CTShippingMethod,
    locale: string
  ): ShippingMethod {
    // Get localized name, fallback to key or id
    const name =
      ctMethod.localizedName?.[locale] ||
      ctMethod.localizedName?.['en-US'] ||
      ctMethod.name ||
      ctMethod.key ||
      ctMethod.id;

    // Get localized description
    const description =
      ctMethod.localizedDescription?.[locale] ||
      ctMethod.localizedDescription?.['en-US'] ||
      ctMethod.description;

    return {
      id: ctMethod.id,
      key: ctMethod.key,
      name,
      description,
      price: {
        centAmount:
          ctMethod.zoneRates[0]?.shippingRates[0]?.price?.centAmount || 0,
        currencyCode:
          ctMethod.zoneRates[0]?.shippingRates[0]?.price?.currencyCode || 'GBP',
        fractionDigits:
          ctMethod.zoneRates[0]?.shippingRates[0]?.price?.fractionDigits || 2,
      },
      isDefault: ctMethod.isDefault || false,
    };
  }
}

export default new ShippingRepository();
