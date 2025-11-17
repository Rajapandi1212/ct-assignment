import { Router } from 'express';
import {
  getCart,
  addToCart,
  applyDiscountCode,
  removeDiscountCodeFromCart,
  updateCartAddresses,
  removeLineItem,
} from './cart-controller';
import { formatResponse } from '../../utils/format-response';

const CartRouter = Router();

// Get cart or create new one if it doesn't exist
CartRouter.get('/', async (req, res, next) => {
  try {
    const cart = await getCart(req);
    const locale = req.locale;
    return formatResponse({
      res,
      req,
      data: cart,
      statusCode: 200,
      sessionData: { cartId: { [locale]: cart?.id } },
    });
  } catch (error) {
    next(error);
  }
});

// Add item to cart
CartRouter.post('/addToCart', async (req, res, next) => {
  try {
    const cart = await addToCart(req);
    return formatResponse({
      req,
      res,
      statusCode: 201,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
});

// Apply discount code to cart
CartRouter.post('/discount/apply', async (req, res, next) => {
  try {
    const cart = await applyDiscountCode(req);
    return formatResponse({
      req,
      res,
      statusCode: 200,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
});

// Remove discount code from cart
CartRouter.post('/discount/remove', async (req, res, next) => {
  try {
    const cart = await removeDiscountCodeFromCart(req);
    return formatResponse({
      req,
      res,
      statusCode: 200,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
});

// Update shipping and billing addresses
CartRouter.post('/addresses', async (req, res, next) => {
  try {
    const cart = await updateCartAddresses(req);
    return formatResponse({
      req,
      res,
      statusCode: 200,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
});

// Remove line item from cart
CartRouter.post('/removeLineItem', async (req, res, next) => {
  try {
    const cart = await removeLineItem(req);
    return formatResponse({
      req,
      res,
      statusCode: 200,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
});

export default CartRouter;
