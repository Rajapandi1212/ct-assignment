import { randomUUID } from 'node:crypto';
import { Cart } from '@commercetools/platform-sdk';
import { SessionData } from '../../../../types/session-data';
import { CartRepository } from './cart-repo';
import logger from '../../utils/logger';

export class CartFetcher {
  static async fetchCart(
    sessionData: SessionData,
    locale: string
  ): Promise<Cart> {
    const cartRepo = new CartRepository();

    logger.info('RP SessionData', sessionData);

    if (sessionData?.userId !== undefined) {
      return await cartRepo.getForUser(sessionData.userId, locale);
    }

    if (sessionData?.cartId?.[locale] !== undefined) {
      try {
        return await cartRepo.getById(sessionData?.cartId?.[locale]);
      } catch (error) {
        logger.info(
          `Error fetching the cart ${sessionData?.cartId?.[locale]}, creating a new one. ${error}`
        );
      }
    }
    const anonymousId = randomUUID();

    return await cartRepo.getAnonymous(anonymousId, locale);
  }
}
