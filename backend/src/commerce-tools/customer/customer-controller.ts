import { Request } from 'express';
import customerRepository from './customer-repo';
import logger from '../../utils/logger';

export const signUp = async (req: Request): Promise<any> => {
  const { email, password, firstName } = req.body;
  const { locale } = req;

  if (!email || !password || !firstName) {
    throw new Error('Email, password, and name are required');
  }

  try {
    // Sign up and auto sign-in (no cart merge on signup)
    const result = await customerRepository.signUp(
      email,
      password,
      firstName,
      locale as string
    );

    logger.info('Customer signed up and signed in successfully', {
      customerId: result.customer.id,
      email,
    });

    return result;
  } catch (error: any) {
    logger.error('Error signing up customer', {
      m: error?.message,
      error,
      email,
    });
    throw new Error(error?.message || 'Failed to sign up');
  }
};

export const signIn = async (req: Request): Promise<any> => {
  const { email, password } = req.body;
  const { locale } = req;
  const sessionData = req.sessionData;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  try {
    const anonymousCartId = sessionData?.cartId?.[locale as string];

    const result = await customerRepository.signIn(
      email,
      password,
      locale,
      anonymousCartId
    );

    logger.info('Customer signed in successfully', {
      customerId: result.customer.id,
      email,
    });

    return result;
  } catch (error: any) {
    logger.error('Error signing in customer', {
      m: error?.message,
      error,
      email,
    });
    throw new Error(error?.message || 'Invalid email or password');
  }
};

export const getMe = async (req: Request): Promise<any> => {
  const sessionData = req.sessionData;
  const customerId = sessionData?.customerId;

  if (!customerId) {
    throw new Error('Not authenticated');
  }

  try {
    const customer = await customerRepository.getById(customerId);
    return customer;
  } catch (error: any) {
    logger.error('Error getting customer', {
      m: error?.message,
      error,
      customerId,
    });
    throw new Error('Failed to get customer information');
  }
};
