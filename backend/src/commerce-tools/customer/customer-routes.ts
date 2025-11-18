import { Router } from 'express';
import { signUp, signIn, getMe } from './customer-controller';
import { formatResponse } from '../../utils/format-response';

const CustomerRouter = Router();

// Sign up
CustomerRouter.post('/signup', async (req, res, next) => {
  try {
    const result = await signUp(req);
    return formatResponse({
      req,
      res,
      statusCode: 201,
      data: result,
      sessionData: {
        customerId: result.customer.id,
        cartId: result.cart ? { [req.locale]: result.cart.id } : {},
      },
    });
  } catch (error) {
    next(error);
  }
});

// Sign in
CustomerRouter.post('/signin', async (req, res, next) => {
  try {
    const result = await signIn(req);
    return formatResponse({
      req,
      res,
      statusCode: 200,
      data: result,
      sessionData: {
        customerId: result.customer.id,
        cartId: result.cart ? { [req.locale]: result.cart.id } : {},
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
CustomerRouter.get('/me', async (req, res, next) => {
  try {
    const customer = await getMe(req);
    return formatResponse({
      req,
      res,
      statusCode: 200,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
});

// Sign out
CustomerRouter.post('/signout', async (req, res, next) => {
  try {
    // Clear all cart IDs by setting each locale to undefined
    const existingCartIds = req.sessionData?.cartId || {};
    const clearedCartIds: Record<string, string | undefined> = {};

    Object.keys(existingCartIds).forEach((locale) => {
      clearedCartIds[locale] = undefined;
    });

    // Clear all user-related session data
    return formatResponse({
      req,
      res,
      statusCode: 200,
      data: { message: 'Signed out successfully' },
      sessionData: {
        customerId: undefined,
        cartId: clearedCartIds,
        anonymousId: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default CustomerRouter;
