export type SessionData = {
  cartId?: Record<string, string>;
  userId?: string;
  email?: string;
  [key: string]: any;
};