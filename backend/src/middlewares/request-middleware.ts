import { NextFunction, Request, Response } from 'express';
import { withRequestContext } from '../utils/async-storage';
import { randomUUID } from 'node:crypto';
import { SESSION_CONFIG } from '../config/security';
import { SessionData } from '../../../types/session-data';
import { decodeToken } from '../utils/jwt';
import { getLocaleFromRequest } from '../utils/get-locale-from-request';

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string;
    sessionData: SessionData;
    locale: string;
  }
}

export const requestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rawToken = req.cookies[SESSION_CONFIG.key];

  if (rawToken) {
    req.sessionData = decodeToken(rawToken);
  }

  const requestId = randomUUID();

  req.requestId = requestId;

  const locale = getLocaleFromRequest(req);

  req.locale = locale;

  const requestContext = { requestId, locale };

  withRequestContext(requestContext, next);
};
