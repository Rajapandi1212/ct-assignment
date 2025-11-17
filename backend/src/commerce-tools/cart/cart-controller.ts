import { Request } from 'express';
import { CartUpdateAction } from '@commercetools/platform-sdk';
import { Cart } from '../../../../types/cart';
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

    // Update cart with new line item (repo handles mapping)
    const updatedCart = await cartRepository.updateCart(
      cart.id,
      cart.version,
      actions,
      locale as string
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

export const applyDiscountCode = async (req: Request): Promise<Cart> => {
  const { code } = req.body;
  const { locale } = req;
  const sessionData = req.sessionData;

  if (!code) {
    throw new Error('Discount code required');
  }

  try {
    // Get current cart
    const cart = await CartFetcher.fetchCart(sessionData, locale as string);

    // Apply discount code (repo handles mapping)
    const updatedCart = await cartRepository.addDiscountCode(
      cart.id,
      cart.version,
      code,
      locale as string
    );

    logger.info('Discount code applied', { cartId: cart.id, code });
    return updatedCart;
  } catch (error: any) {
    logger.error('Error applying discount code', {
      m: error?.message,
      error,
      code,
      sessionData,
    });
    throw new Error(error?.message || 'Failed to apply discount code');
  }
};

export const removeDiscountCodeFromCart = async (
  req: Request
): Promise<Cart> => {
  const { discountCodeId } = req.body;
  const { locale } = req;
  const sessionData = req.sessionData;

  if (!discountCodeId) {
    throw new Error('Discount code ID required');
  }

  try {
    // Get current cart
    const cart = await CartFetcher.fetchCart(sessionData, locale as string);

    // Remove discount code (repo handles mapping)
    const updatedCart = await cartRepository.removeDiscountCode(
      cart.id,
      cart.version,
      discountCodeId,
      locale as string
    );

    logger.info('Discount code removed', { cartId: cart.id, discountCodeId });
    return updatedCart;
  } catch (error: any) {
    logger.error('Error removing discount code', {
      m: error?.message,
      error,
      discountCodeId,
      sessionData,
    });
    throw new Error(error?.message || 'Failed to remove discount code');
  }
};

export const removeLineItem = async (req: Request): Promise<Cart> => {
  const { lineItemId } = req.body;
  const { locale } = req;
  const sessionData = req.sessionData;

  if (!lineItemId) {
    throw new Error('Line item ID required');
  }

  try {
    // Get current cart
    const cart = await CartFetcher.fetchCart(sessionData, locale as string);

    // Remove line item (repo handles mapping)
    const updatedCart = await cartRepository.removeLineItem(
      cart.id,
      cart.version,
      lineItemId,
      locale as string
    );

    logger.info('Line item removed', { cartId: cart.id, lineItemId });
    return updatedCart;
  } catch (error: any) {
    logger.error('Error removing line item', {
      m: error?.message,
      error,
      lineItemId,
      sessionData,
    });
    throw new Error(error?.message || 'Failed to remove line item');
  }
};

export const updateCartAddresses = async (req: Request): Promise<Cart> => {
  const { address } = req.body;
  const { locale } = req;
  const sessionData = req.sessionData;

  if (!address) {
    throw new Error('Address required');
  }

  // Validate required fields
  const requiredFields = [
    'firstName',
    'lastName',
    'streetName',
    'city',
    'postalCode',
    'country',
    'phone',
    'email',
  ];

  for (const field of requiredFields) {
    if (!address[field]) {
      throw new Error(`${field} is required`);
    }
  }

  try {
    // Get current cart
    const cart = await CartFetcher.fetchCart(sessionData, locale as string);

    // Update addresses (repo handles mapping)
    const updatedCart = await cartRepository.updateAddresses(
      cart.id,
      cart.version,
      address,
      locale as string
    );

    logger.info('Cart addresses updated', { cartId: cart.id });
    return updatedCart;
  } catch (error: any) {
    logger.error('Error updating cart addresses', {
      m: error?.message,
      error,
      address,
      sessionData,
    });
    throw new Error(error?.message || 'Failed to update addresses');
  }
};
