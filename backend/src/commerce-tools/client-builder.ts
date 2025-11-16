import {
  ClientBuilder,
  MiddlewareResponse,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';
import { ctClientConfig } from '../config/ct';
import logger from '../utils/logger';

export const projectKey = ctClientConfig.projectKey;
const scopes = [ctClientConfig.scopes];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: ctClientConfig.authUrl,
  projectKey,
  credentials: {
    clientId: ctClientConfig.clientId,
    clientSecret: ctClientConfig.clientSecret,
  },
  scopes,
  httpClient: fetch,
};

const httpAPIHTTPMiddlewareOptions: HttpMiddlewareOptions = {
  includeOriginalRequest: true,
  includeRequestInErrorResponse: true,
  host: ctClientConfig.apiUrl,
  httpClient: fetch,
};

const customLoggerMiddleware = {
  maskSensitiveData: true,
  loggerFn: (res: MiddlewareResponse) => {
    const req = res?.originalRequest;
    logger.http('ct-request', {
      method: req?.method,
      status: res?.statusCode,
      uriTemplate: req?.uriTemplate,
      queryParams: req?.queryParams,
    });
  },
};

export const ctpClientHTTPAPI = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpAPIHTTPMiddlewareOptions)
  .withLoggerMiddleware(customLoggerMiddleware)
  .build();
