import { Response } from 'express';
import { ApiResponse } from '../../../types';
import { generateToken } from './jwt';
import { SESSION_CONFIG } from '../config/security';
import { isProd } from '../config/isProd';

/**
 * Utility function to send a standardized API response.
 * @param res Express response object
 * @param statusCode HTTP status code
 * @param data Data to send (optional)
 * @param error Error message (optional)
 */
export function formatResponse<T>({
  res,
  statusCode,
  data,
  error,
  sessionData,
}: {
  res: Response;
  statusCode: number;
  data?: T;
  error?: { message: string; code?: string };
  sessionData?: Record<string, unknown>;
}) {
  if (sessionData) {
    const token = generateToken(sessionData);
    res.cookie(SESSION_CONFIG.key, token, {
      expires: new Date(Date.now() + SESSION_CONFIG.expireMs),
      httpOnly: true,
      secure: isProd ? true : false,
    });
  }

  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    ...(data ? { data } : {}),
    ...(error ? { error } : {}),
  };

  return res.status(statusCode).json(response);
}
