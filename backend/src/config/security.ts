import { ENV } from './env';

export const JWT_CONFIG = {
  SECRET_KEY: ENV.JWT_SECRET_KEY,
};

export const SESSION_CONFIG = {
  key: ENV.SESSION_KEY,
  expireMs: Number(ENV.SESSION_EXPIRE_TIME) * 60 * 60 * 1000,
};
