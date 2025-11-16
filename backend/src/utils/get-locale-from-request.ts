import { Request } from 'express';
import { CT_DEFAULT_LOCALE } from '../config/ct';

export const getLocaleFromRequest = (req: Request) => {
  return req?.headers?.['accept-language'] || CT_DEFAULT_LOCALE;
};
