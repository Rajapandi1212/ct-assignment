import { Response, Request } from 'express';
import { ApiResponse } from '../../../types';
import { generateToken } from './jwt';
import { SESSION_CONFIG } from '../config/security';
import { isProd } from '../config/isProd';
import { SessionData } from '../../../types/session-data';
import { formatSession } from './format-session';

/**
 * Utility function to send a standardized API response.
 * @param res Express response object
 * @param statusCode HTTP status code
 * @param data Data to send (optional)
 * @param error Error message (optional)
 */
export function formatResponse<T>({
  res,
  req,
  statusCode = 200,
  data,
  error,
  sessionData,
}: {
  res: Response;
  req: Request;
  statusCode?: number;
  data?: T;
  error?: { message: string; code?: string };
  sessionData?: SessionData;
}) {
  let formattedSessionData = req?.sessionData || {};
  if (sessionData) {
    formattedSessionData = formatSession(req?.sessionData || {}, sessionData);
  }
  const token = generateToken(formattedSessionData);
  res.cookie(SESSION_CONFIG.key, token, {
    expires: new Date(Date.now() + SESSION_CONFIG.expireMs),
    httpOnly: true,
    secure: isProd ? true : false,
  });

  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    ...(data ? { data } : {}),
    ...(error ? { error } : {}),
  };

  return res.status(statusCode).json(response);
}
