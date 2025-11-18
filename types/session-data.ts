export type SessionData = {
  cartId?: Record<string, string | undefined>;
  userId?: string;
  email?: string;
  [key: string]: any;
};