import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from './logger';
import { JWT_CONFIG, SESSION_CONFIG } from '../config/security';
import { SessionData } from '../../../types/session-data';

export const generateToken = (payload: SessionData) => {
  return jwt.sign(payload, JWT_CONFIG.SECRET_KEY, {
    expiresIn: SESSION_CONFIG.expireMs,
  });
};

export const decodeToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(token, JWT_CONFIG.SECRET_KEY) as JwtPayload;
    delete decodedToken.iat;
    delete decodedToken.exp;
    return decodedToken as SessionData;
  } catch (error) {
    logger.warn('JWT token verify error: ', { error });
    return {};
  }
};
