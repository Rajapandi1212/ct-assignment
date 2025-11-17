import { Request, Response, NextFunction } from 'express';
import { formatResponse } from '../utils/format-response';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const error = {
    code: err.name,
    message: err.message || 'Internal Server Error',
  };

  logger.error(err?.name || 'ERROR', {
    ...error,
    originalError: err,
    stack: err.stack,
  });

  return formatResponse({ req, res, statusCode: 500, error });
};
