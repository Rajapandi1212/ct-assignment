import { BaseRepository } from '../base-repo';
import logger from '../../utils/logger';
import { CartMapper } from '../cart/cart-mapper';

export class CustomerRepository extends BaseRepository {
  /**
   * Sign up a new customer (without cart merge - that happens on sign-in)
   */
  public async signUp(
    email: string,
    password: string,
    firstName: string,
    locale: string
  ): Promise<any> {
    try {
      const response = await this.requestBuilder()
        .customers()
        .post({
          body: {
            email,
            password,
            firstName,
          },
        })
        .execute();

      logger.info('Customer signed up', {
        customerId: response.body.customer.id,
        email,
      });

      // Auto sign-in after signup
      return this.signIn(email, password, locale, undefined);
    } catch (error: any) {
      logger.error('Failed to sign up customer', { error, email });
      throw new Error(error.message || 'Failed to sign up');
    }
  }

  /**
   * Sign in a customer with cart merge support
   * Only merges the cart for the current locale
   */
  public async signIn(
    email: string,
    password: string,
    locale: string,
    anonymousCartId?: string
  ): Promise<any> {
    try {
      const response = await this.requestBuilder()
        .login()
        .post({
          body: {
            email,
            password,
            ...(anonymousCartId && {
              anonymousCart: {
                typeId: 'cart',
                id: anonymousCartId,
              },
              anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
            }),
          },
        })
        .execute();

      logger.info('Customer signed in', {
        customerId: response.body.customer.id,
        email,
        cartMerged: !!anonymousCartId,
      });

      return {
        customer: {
          id: response.body.customer.id,
          email: response.body.customer.email,
          firstName: response.body.customer.firstName,
          version: response.body.customer.version,
        },
        cart: response.body.cart
          ? CartMapper.mapCart(response.body.cart, locale)
          : null,
      };
    } catch (error: any) {
      logger.error('Failed to sign in customer', { error, email });
      throw new Error('Invalid email or password');
    }
  }

  /**
   * Get customer by ID
   */
  public async getById(customerId: string): Promise<any> {
    try {
      const response = await this.requestBuilder()
        .customers()
        .withId({ ID: customerId })
        .get()
        .execute();

      return {
        id: response.body.id,
        email: response.body.email,
        firstName: response.body.firstName,
        version: response.body.version,
      };
    } catch (error: any) {
      logger.error('Failed to get customer', { error, customerId });
      throw new Error('Customer not found');
    }
  }
}

export default new CustomerRepository();
