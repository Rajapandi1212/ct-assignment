import { Response } from 'express';
import { ApiResponse } from '../../../types';

/**
 * Utility function to send a standardized API response.
 * @param res Express response object
 * @param statusCode HTTP status code
 * @param data Data to send (optional)
 * @param error Error message (optional)
 */
export function formatResponse<T>(
  res: Response,
  statusCode: number,
  data?: T,
  error?: { message: string; code?: string }
) {
  let token = {};
  //   if (res?.sessionData) {
  //     token = generateToken(res?.sessionData);
  //   }
  //   res.cookie(SESSION_KEY, token, {
  //     expires: new Date(Date.now() + SESSION_EXPIRE_TIME),
  //     httpOnly: true,
  //     secure: isProd ? true : false,
  //   });
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    ...(data ? { data } : {}),
    ...(error ? { error } : {}),
  };

  return res.status(statusCode).json(response);
}
