import { Request } from 'express';
import { Cart, CartUpdateAction } from '@commercetools/platform-sdk';
import cartRepository from './cart-repo';
import { CartFetcher } from './cart-fetcher';
import logger from '../../utils/logger';

export const getCart = async (req: Request): Promise<Cart> => {
  const { locale } = req;
  const sessionData = req.sessionData;

  try {
    const cart = await CartFetcher.fetchCart(sessionData, locale as string);
    return cart;
  } catch (error: any) {
    logger.error('Error getting cart', {
      m: error?.message,
      error,
      sessionData,
      locale,
    });
    throw new Error(error?.message || 'Failed to get cart');
  }
};

export const addToCart = async (req: Request): Promise<Cart> => {
  const { sku, quantity = 1 } = req.body;
  const { locale } = req;
  const sessionData = req.sessionData;

  if (!sku) {
    throw new Error('SKU required');
  }

  try {
    // First get or create cart
    const cart = await CartFetcher.fetchCart(sessionData, locale as string);

    // Prepare line item add action
    const actions: CartUpdateAction[] = [
      {
        action: 'addLineItem',
        sku: sku,
        quantity: parseInt(quantity, 10) || 1,
      },
    ];

    // Update cart with new line item
    const updatedCart = await cartRepository.updateCart(
      cart.id,
      cart.version,
      actions
    );

    return updatedCart;
  } catch (error: any) {
    logger.error('Error adding to cart', {
      m: error?.message,
      error,
      sku,
      quantity,
      sessionData,
    });
    throw new Error(error?.message || 'Failed to add item to cart');
  }
};
